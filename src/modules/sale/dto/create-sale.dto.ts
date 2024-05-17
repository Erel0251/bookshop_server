import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsObject, IsString } from 'class-validator';
import { CreateSaleBookDto } from './create-sale-book.dto';

export class CreateSaleDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsDate()
  @ApiProperty()
  from: Date;

  @IsDate()
  @ApiProperty()
  to: Date;

  @IsObject({ each: true })
  @ApiProperty()
  sale_books: CreateSaleBookDto[];
}
