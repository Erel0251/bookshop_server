import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { CreateSupplementDetailDto } from './create-supplement-detail.dto';

export class CreateSupplementDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsNumber()
  @ApiProperty()
  total_quantity: number;

  @IsNumber()
  @ApiProperty()
  total_price: number;

  @IsString()
  @ApiProperty()
  currency: string;

  @IsString()
  @ApiPropertyOptional()
  supplier?: string;

  @IsArray()
  @ApiPropertyOptional({ type: [CreateSupplementDetailDto] })
  supplement_details?: CreateSupplementDetailDto[];
}
