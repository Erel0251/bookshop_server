import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Order } from '../constants/order.enum';

export class CommonDto {
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiPropertyOptional({ required: false })
  sort?: Order = Order.DESC;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ required: false })
  offset?: number = 0;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ required: false })
  limit?: number = 10;
}
