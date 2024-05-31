import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Order } from '../constants/order.enum';

export class CommonDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  sortBy?: string = 'updated_at';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiPropertyOptional()
  order?: Order = Order.DESC;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  offset?: number = 0;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  limit?: number = 20;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_deleted?: boolean = false;
}
