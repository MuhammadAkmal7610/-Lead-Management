import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDealStatusDto {
  @IsEnum(['registered', 'documents_uploaded', 'closed', 'cancelled'])
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}