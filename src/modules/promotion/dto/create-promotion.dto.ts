import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsObject, IsString } from 'class-validator';
import { UpdatePromotionBookDto } from './update-promotion-book.dto';
import { PromotionType } from '../constants/promotion-type.enum';

export class CreatePromotionDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsEnum(PromotionType)
  @ApiProperty()
  type: PromotionType;

  @IsDate()
  @ApiProperty()
  from: Date;

  @IsDate()
  @ApiProperty()
  to: Date;

  @IsObject({ each: true })
  @ApiPropertyOptional({ type: () => [UpdatePromotionBookDto] })
  promotion_books?: UpdatePromotionBookDto[];
}
