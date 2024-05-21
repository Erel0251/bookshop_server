import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDetailDto } from './create-order-detail.dto';
import { IsUUID } from 'class-validator';

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) {
  @IsUUID()
  @ApiProperty()
  order_id: string;
}
