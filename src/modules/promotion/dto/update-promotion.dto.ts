import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion.dto';
import { IsUUID } from 'class-validator';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @IsUUID()
  @ApiProperty()
  id: string;
}
