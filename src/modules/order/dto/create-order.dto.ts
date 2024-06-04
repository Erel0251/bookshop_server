import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsString } from 'class-validator';
import { OrderStatus } from '../constants/order-status.enum';
import { CreateOrderDetailDto } from './create-order-detail.dto';

export class CreateOrderDto {
  @IsString()
  @ApiProperty()
  user_id: string;

  @IsString()
  @ApiProperty()
  province: string;

  @IsString()
  @ApiProperty()
  district: string;

  @IsString()
  @ApiProperty()
  ward: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsNumberString()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiPropertyOptional()
  status: OrderStatus = OrderStatus.PENDING;

  @ApiProperty({ type: [CreateOrderDetailDto] })
  order_details: CreateOrderDetailDto[];

  id: string;
}
