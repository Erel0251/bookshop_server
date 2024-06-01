import { IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonDto } from '../../../shared/dto/common.dto';

export class QueryPromotionDto extends CommonDto {
  @IsString()
  @ApiPropertyOptional()
  keyword?: string;

  @IsString()
  @ApiPropertyOptional()
  category?: string;

  @IsNumber()
  @ApiPropertyOptional()
  rating?: number;

  @IsNumber()
  @ApiPropertyOptional()
  fromPrice?: number;

  @IsNumber()
  @ApiPropertyOptional()
  toPrice?: number;

  constructor(partial: Partial<QueryPromotionDto>) {
    super();
    Object.assign(this, partial);
  }
}
