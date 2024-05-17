import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { BookStatus } from '../constants/status.enum';

export class CreateBookDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  publisher: string;

  @IsString({ each: true })
  @IsArray()
  @ApiProperty({ type: [String] })
  img_urls: string[];

  @IsString()
  @ApiPropertyOptional()
  overview?: string;

  @IsString()
  @ApiPropertyOptional()
  isbn?: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsString()
  @ApiProperty()
  status: BookStatus;

  @IsString()
  @ApiProperty()
  currency: string;

  @IsBoolean()
  @ApiPropertyOptional()
  is_recommended?: boolean;

  @IsNumber()
  @ApiPropertyOptional()
  buy_count?: number;

  @IsNumber()
  @ApiPropertyOptional()
  inventory?: number;

  @IsArray()
  @ApiPropertyOptional()
  categories?: any[];

  @IsArray()
  @ApiPropertyOptional()
  authors?: any[];

  @IsArray()
  @ApiPropertyOptional()
  ratings?: any[];

  @IsArray()
  @ApiPropertyOptional()
  sale?: any[];

  @IsArray()
  @ApiPropertyOptional()
  cartItem?: any[];

  @IsArray()
  @ApiPropertyOptional()
  orderDetail?: any[];

  @IsArray()
  @ApiPropertyOptional()
  supplementDetail?: any[];
}
