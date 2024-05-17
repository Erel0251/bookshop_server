import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

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
  @ApiProperty()
  supplement_details: SupplementDetailDto[];
}

class SupplementDetailDto {
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsString()
  @ApiProperty()
  currency: string;

  @ApiProperty()
  book: any;
}
