 import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lead } from './schemas/lead.schema';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto';
import { User } from '../users/schemas/user.schemas';

@Injectable()
export class LeadsService {
  constructor(@InjectModel(Lead.name) private leadModel: Model<Lead>) {}
 
 async create(dto: CreateLeadDto, user: User): Promise<Lead> {
  if (!['admin', 'marketer'].includes(user.role)) {
    throw new ForbiddenException('Only admin and marketer can create leads');
  }

  return this.leadModel.create({
    ...dto,
    createdBy: new Types.ObjectId(user._id),
    status: 'new',
    isHot: dto.isHot ?? false,
  });
}

 
  async verify(leadId: string): Promise<Lead> {
    const lead = await this.leadModel.findById(leadId);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.status !== 'new') {
      throw new BadRequestException(`Cannot verify lead in status: ${lead.status}`);
    }

    lead.status = 'verified';
    return lead.save();
  }
 
 async purchase(leadId: string, brokerId: string): Promise<Lead> {
  const session = await this.leadModel.startSession();
  session.startTransaction();

  try {
    const now = new Date();

    const lead = await this.leadModel.findOne({
      _id: new Types.ObjectId(leadId),
      status: 'verified',
      $or: [
        { purchasedBy: null },
        { exclusivityEndDate: { $lt: now } },
      ],
    }).session(session);

    if (!lead) {
      throw new BadRequestException('Lead not available for purchase');
    }

    lead.purchasedBy = new Types.ObjectId(brokerId);
    lead.exclusivityEndDate = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    await lead.save({ session });
    await session.commitTransaction();
    return lead;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}

 
 async getAvailableLeadsForMarketplace(): Promise<any[]> {
  const now = new Date();

  // Fetch leads that are either not purchased or whose exclusivity has expired
  const leads = await this.leadModel
    .find({
      status: 'verified',
      $or: [
        { purchasedBy: null },
        { exclusivityEndDate: { $lt: now } }
      ],
    })
    .select('name phone location propertyType budget timeline exclusivityEndDate createdAt')
    .lean();

  // Mask sensitive info before returning
  return leads.map((lead) => ({
    ...lead,
    name: this.maskName(lead.name),
    phone: this.maskPhone(lead.phone),
  }));
}


 
  async getLeadDetail(leadId: string, currentUser: User): Promise<any> {
    const lead = await this.leadModel.findById(leadId);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
 
    if (currentUser.role === 'admin') {
      return lead;
    }
 
    if (currentUser.role === 'marketer') {
      if (lead.createdBy.toString() !== currentUser._id.toString()) {
        throw new ForbiddenException('You can only view leads you created');
      }
      return lead;
    }
 
    if (currentUser.role === 'broker') {
      const now = new Date();
 
      if (!lead.purchasedBy || (lead.exclusivityEndDate && lead.exclusivityEndDate < now)) {
        return {
          ...lead.toObject(),
          name: this.maskName(lead.name),
          phone: this.maskPhone(lead.phone),
          purchasedBy: undefined,
          exclusivityEndDate: undefined,
        };
      }
 
      if (lead.purchasedBy.toString() === currentUser._id.toString()) {
        return lead;
      }
 
      throw new ForbiddenException('This lead is not available to you');
    }

    throw new ForbiddenException('Access denied');
  }
  async getLeadsByStatus(status: string): Promise<Lead[]> {
    const leads = await this.leadModel.find({ status }).lean();
    if (!leads || leads.length === 0) {
      throw new NotFoundException(`No leads found with status: ${status}`);
    }
    return leads;
  }
  async getAllLeads( ): Promise<Lead[]> {
    const leads = await this.leadModel.find().lean();
    if (!leads || leads.length === 0) {
      throw new NotFoundException(`No leads found`);
    }
    return leads;
  }
  private maskName(fullName: string): string {
    if (!fullName) return 'N/A';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0) + '***';
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
 
  private maskPhone(phone: string): string {
    if (!phone) return 'N/A';
    if (phone.length < 8) return '******';
    return phone.slice(0, 3) + '******' + phone.slice(-2);
  }
}