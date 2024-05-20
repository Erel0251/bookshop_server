import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePromotionBookDto } from './create-promotion-book.dto';
import { IsUUID } from 'class-validator';

export class UpdatePromotionBookDto extends PartialType(
  CreatePromotionBookDto,
) {
  @IsUUID()
  @ApiProperty()
  id: string;
}
