import { PartialType } from '@nestjs/swagger';
import { CreateSaleBookDto } from './create-sale-book.dto';

export class UpdateSaleBookDto extends PartialType(CreateSaleBookDto) {}
