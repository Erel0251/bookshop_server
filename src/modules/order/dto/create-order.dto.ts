import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator';
import { OrderStatus } from '../constants/order-status.enum';

export class CreateOrderDto {
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

  @IsNumberString()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiPropertyOptional()
  status?: OrderStatus;

  @IsNumber()
  @ApiProperty()
  total_price: number;

  @ApiProperty()
  order_details: CreateOrderDto[];

  id: string;
}
