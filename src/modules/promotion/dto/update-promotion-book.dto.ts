import { PartialType } from '@nestjs/swagger';
import { CreatePromotionBookDto } from './create-promotion-book.dto';

export class UpdateSaleBookDto extends PartialType(CreatePromotionBookDto) {}
