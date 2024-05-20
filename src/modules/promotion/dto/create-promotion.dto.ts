import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsObject, IsString } from 'class-validator';
import { CreatePromotionBookDto } from './create-promotion-book.dto';

export class CreatePromotionDto {
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
  @ApiPropertyOptional()
  promotion_books?: CreatePromotionBookDto[];
}
