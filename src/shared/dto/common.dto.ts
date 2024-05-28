import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { Order } from '../constants/order.enum';

export class CommonDto {
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiPropertyOptional()
  sort?: Order = Order.DESC;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  offset?: number = 0;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  limit?: number = 10;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_deleted?: boolean = false;
}
