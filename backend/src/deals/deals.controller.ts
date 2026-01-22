 import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ParseMongoIdPipe } from '../common/parse-mongo-id.pipe';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { User } from '../users/schemas/user.schemas';
import { Types } from 'mongoose';

@Controller('deals')
@UseGuards(AuthGuard('jwt'))
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

 // Broker creates deal for purchased lead
@Post()
@UseGuards(RolesGuard)
@Roles('broker')
@HttpCode(HttpStatus.CREATED)
async create(
  @Body() dto: CreateDealDto,
  @CurrentUser() user: any,
) {
  console.log(user,'user in deal controller');
  
  return this.dealsService.createDeal(
    dto,
      user.userId,
  );
}


  
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('broker', 'admin')
  async updateStatus(
    @Param('id', ParseMongoIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateDealStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.dealsService.updateDealStatus(
      id.toString(),
      dto,
      user.userId,
      user.role,
    );
  }

  // Broker sees his own deals
  @Get('my-deals')
  @UseGuards(RolesGuard)
  @Roles('broker')
  async getMyDeals(@CurrentUser() user: User) {
    return this.dealsService.getMyDeals(user._id.toString());
  }

  // Admin sees all deals
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllDeals() {
    return this.dealsService.getAllDealsForAdmin();
  }

  // Get single deal detail (broker sees own, admin sees any)
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('broker', 'admin')
  async getDeal(
    @Param('id', ParseMongoIdPipe) id: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.dealsService.getDealById(
      id.toString(),
      user._id.toString(),
      user.role,
    );
  }
}