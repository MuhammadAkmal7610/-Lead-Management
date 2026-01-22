import { IsMongoId, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateDealDto {
  @IsMongoId()
  leadId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isHot?: boolean;
}
