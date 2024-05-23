import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { CreateSupplementDetailDto } from './create-supplement-detail.dto';

export class CreateSupplementDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsNumber()
  @ApiPropertyOptional()
  total_quantity: number = 0;

  @IsNumber()
  @ApiPropertyOptional()
  total_price: number = 0;

  @IsString()
  @ApiPropertyOptional()
  currency: string = 'VND';

  @IsString()
  @ApiProperty()
  supplier: string;

  @IsDate()
  @ApiPropertyOptional()
  date?: Date = new Date();

  @IsArray()
  @ApiPropertyOptional({ type: () => [CreateSupplementDetailDto] })
  supplement_details?: CreateSupplementDetailDto[];
}
