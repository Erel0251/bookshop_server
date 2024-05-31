import { IsNumber, IsString } from 'class-validator';
import { BookStatus } from '../constants/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonDto } from '../../../shared/dto/common.dto';

export class QueryBookDto extends CommonDto {
  @IsString()
  @ApiPropertyOptional()
  keyword?: string;

  @IsString()
  @ApiPropertyOptional()
  status?: BookStatus;

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

  constructor(partial: Partial<QueryBookDto>) {
    super();
    Object.assign(this, partial);
  }
}
