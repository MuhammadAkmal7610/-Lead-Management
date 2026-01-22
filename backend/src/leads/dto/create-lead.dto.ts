import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { PropertyType, Timeline } from '../enums';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsEnum(Timeline)
  timeline: Timeline;

  @IsOptional()
  @IsBoolean()
  isHot?: boolean;
}
