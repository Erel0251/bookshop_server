import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';

export class CreateSupplementDetailDto {
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
  @ApiPropertyOptional()
  bookId?: string;

  @ApiPropertyOptional({ type: () => CreateBookDto })
  book?: CreateBookDto;
}
