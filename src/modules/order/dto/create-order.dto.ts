import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';

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

  @IsNumber()
  @ApiProperty()
  total_price: number;

  @ApiProperty()
  order_details: OrderDetailDto[];
}

class OrderDetailDto {
  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiPropertyOptional()
  discount?: number;

  @IsNumber()
  @ApiProperty({ default: 1 })
  quantity: number;

  @IsNumber()
  @ApiPropertyOptional()
  total_price?: number;

  @ApiPropertyOptional()
  books?: CreateBookDto;
}
