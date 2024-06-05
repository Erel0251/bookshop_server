import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsString,
} from 'class-validator';
import { CommonDto } from '../../../shared/dto/common.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../constants/order-status.enum';

export class QueryOrderDto extends CommonDto {
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsEmail()
  @ApiPropertyOptional()
  email?: string;

  @IsNumberString()
  @ApiPropertyOptional()
  phone?: string;

  @IsDate()
  @ApiPropertyOptional()
  date?: Date;

  @IsEnum({ OrderStatus })
  @ApiPropertyOptional({ enum: OrderStatus })
  status?: OrderStatus;

  constructor(partial: Partial<QueryOrderDto>) {
    super();
    Object.assign(this, partial);
  }
}
