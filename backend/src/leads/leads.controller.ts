 import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
 Query
} from '@nestjs/common';
import { ParseMongoIdPipe } from '../common/parse-mongo-id.pipe';
import { LeadsService } from './leads.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schemas';
import { Types } from 'mongoose';
 @Controller('leads')
@UseGuards(AuthGuard('jwt'))
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'marketer')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateLeadDto,
    @CurrentUser() user: User,
  ) {
    return this.leadsService.create(dto, user);
  }

  @Post(':id/verify')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async verify(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.leadsService.verify(id.toString());
  }

  @Post(':id/purchase')
  @UseGuards(RolesGuard)
  @Roles('broker')
  async purchase(
    @Param('id', ParseMongoIdPipe) id: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.leadsService.purchase(id.toString(), user._id.toString());
  }

  @Get('marketplace')
  @UseGuards(RolesGuard)
  @Roles('broker')
  async marketplace() {
    return this.leadsService.getAvailableLeadsForMarketplace();
  }
  @Get()
  async getLeads(@Query('status') status: string) {
    return this.leadsService.getLeadsByStatus(status);
  }
   @Get('detail')
  async getAllLeads( ) {
    return this.leadsService.getAllLeads();
  }
}
