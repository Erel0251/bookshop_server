import { IsNumberString, IsString } from 'class-validator';
import { BookStatus } from '../constants/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonDto } from '../../../shared/dto/common.dto';

export class QueryBookDto extends CommonDto {
  @IsString()
  @ApiPropertyOptional()
  title?: string;

  @IsNumberString()
  @ApiPropertyOptional()
  isbn?: string;

  @IsString()
  @ApiPropertyOptional()
  publisher?: string;

  @IsString()
  @ApiPropertyOptional()
  status?: BookStatus;

  constructor(partial: Partial<QueryBookDto>) {
    super();
    Object.assign(this, partial);
  }
}
