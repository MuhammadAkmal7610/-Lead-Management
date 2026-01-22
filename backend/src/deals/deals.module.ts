import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deal, DealSchema } from './schemas/deal.schema';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { LeadsModule } from '../leads/leads.module';   // ← add this line

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }]),
    LeadsModule,  
  ],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [
    MongooseModule,      
    LeadsModule,         
  ],
})
export class DealsModule {}
