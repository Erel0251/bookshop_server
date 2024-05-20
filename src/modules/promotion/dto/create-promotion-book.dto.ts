import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsObject, IsString } from 'class-validator';
import { UpdateBookDto } from 'src/modules/book/dto/update-book.dto';
import { UpdatePromotionDto } from './update-promotion.dto';

export class CreatePromotionBookDto {
  @IsString()
  @ApiProperty()
  saleId: string;

  @IsString()
  @ApiProperty()
  bookId: string;

  @IsInt()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiProperty()
  discount: number;

  @IsObject()
  @ApiProperty()
  promotion: UpdatePromotionDto;

  @IsObject()
  @ApiProperty()
  book: UpdateBookDto;
}
