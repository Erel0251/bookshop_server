import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';

export class CreateOrderDetailDto {
  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiPropertyOptional()
  discount?: number;

  @IsNumber()
  @ApiProperty({ default: 1 })
  quantity: number;

  @IsNumber()
  @ApiPropertyOptional()
  total_price?: number;

  @ApiPropertyOptional()
  books?: CreateBookDto;

  @IsUUID()
  @ApiProperty()
  book_id: string;
}
