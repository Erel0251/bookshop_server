import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
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

  @IsNumber()
  @ApiPropertyOptional()
  inventory?: number;
}
