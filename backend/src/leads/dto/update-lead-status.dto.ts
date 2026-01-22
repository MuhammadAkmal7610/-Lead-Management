import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLeadStatusDto {
  @IsEnum(['new', 'verified', 'contacted', 'purchased', 'sold', 'expired', 'rejected'])
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string; // optional - useful when status = 'rejected'

  @IsString()
  @IsOptional()
  adminComment?: string; // optional internal note
}