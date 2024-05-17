import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';

export class SupplementDetailDto {
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsString()
  @ApiProperty()
  currency: string;

  @IsUUID()
  @ApiProperty()
  bookId: string;

  @ApiPropertyOptional({ type: CreateBookDto })
  book?: CreateBookDto;
}

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
  @ApiPropertyOptional({ type: [SupplementDetailDto] })
  supplement_details?: SupplementDetailDto[];
}
