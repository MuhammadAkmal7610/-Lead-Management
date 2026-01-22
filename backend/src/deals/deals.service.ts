import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Deal } from './schemas/deal.schema';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { Lead } from '../leads/schemas/lead.schema';

@Injectable()
export class DealsService {
  constructor(
    @InjectModel(Deal.name) private dealModel: Model<Deal>,
    @InjectModel(Lead.name) private leadModel: Model<Lead>,
  ) {}

  async createDeal(dto: CreateDealDto, brokerId: string): Promise<Deal> {
  const session = await this.dealModel.startSession();
  session.startTransaction();

  try {
    // Fetch the lead
    const lead = await this.leadModel.findById(dto.leadId).session(session);
    if (!lead) throw new NotFoundException('Lead not found');

    // Validate lead state
    if (!['verified', 'purchased'].includes(lead.status))
      throw new BadRequestException('Lead is not in valid state for deal registration');

    
    // Validate exclusivity
    if (lead.exclusivityEndDate && lead.exclusivityEndDate < new Date())
      throw new BadRequestException('Lead exclusivity has expired');

    // Check for existing deal
    const existingDeal = await this.dealModel.findOne({ lead: lead._id }).session(session);
    if (existingDeal) throw new BadRequestException('Deal already registered for this lead');

    // Create deal
    const deal = await this.dealModel.create(
      [
        {
          lead: lead._id,
          broker: new Types.ObjectId(brokerId),
          status: 'registered',
          notes: dto.notes,
          isHot: dto.isHot ?? false,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return deal[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}


  async updateDealStatus(
    dealId: string,
    dto: UpdateDealStatusDto,
    userId: string,
    userRole: string,
  ): Promise<Deal> {
    const deal = await this.dealModel.findById(dealId);

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    // Only admin or the broker who owns it can update
    const isAdmin = userRole === 'admin';
   if (!deal.broker) {
  throw new BadRequestException('Deal has no broker assigned');
}

//const isOwner = deal.broker.toString() === userId;

    if (!isAdmin  ) {
      throw new ForbiddenException('You are not authorized to update this deal');
    }

    // Validate state transitions (simple version)
    const allowedTransitions: Record<string, string[]> = {
      registered: ['documents_uploaded', 'cancelled'],
      documents_uploaded: ['closed', 'cancelled'],
      closed: [],
      cancelled: [],
    };

    if (!allowedTransitions[deal.status].includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${deal.status} to ${dto.status}`,
      );
    }

    Object.assign(deal, {
      status: dto.status,
      notes: dto.notes ?? deal.notes,
      rejectionReason: dto.rejectionReason,
      lastUpdatedBy: new Types.ObjectId(userId),
      ...(dto.status === 'documents_uploaded' && { documentsUploadedAt: new Date() }),
      ...(dto.status === 'closed' && { closedAt: new Date() }),
    });

    return deal.save();
  }

  async getDealById(dealId: string, userId: string, userRole: string): Promise<Deal> {
    const deal = await this.dealModel
      .findById(dealId)
      .populate('lead broker', 'name email');

    if (!deal) throw new NotFoundException('Deal not found');

    const isAdmin = userRole === 'admin';
    const isOwner = deal.broker.toString() === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You cannot view this deal');
    }

    return deal;
  }

  async getMyDeals(brokerId: string): Promise<Deal[]> {
    return this.dealModel
      .find({ broker: new Types.ObjectId(brokerId) })
      .populate('lead', 'name location propertyType budget')
      .sort({ createdAt: -1 });
  }

  async getAllDealsForAdmin(): Promise<Deal[]> {
    return this.dealModel
      .find()
      .populate('lead broker', 'name email')
      .sort({ createdAt: -1 });
  }
}