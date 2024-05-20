import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsObject, IsUUID } from 'class-validator';
import { UpdateBookDto } from 'src/modules/book/dto/update-book.dto';

export class CreatePromotionBookDto {
  @IsInt()
  @ApiPropertyOptional()
  quantity?: number;

  @IsNumber()
  @ApiPropertyOptional()
  price?: number;

  @IsNumber()
  @ApiPropertyOptional()
  discount?: number;

  @IsObject()
  @ApiPropertyOptional()
  book?: UpdateBookDto;

  @IsUUID()
  @ApiPropertyOptional()
  promotion_id?: string;

  @IsUUID()
  @ApiPropertyOptional()
  book_id?: string;
}
