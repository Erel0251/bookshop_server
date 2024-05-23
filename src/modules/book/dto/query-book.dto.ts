import { IsNumberString, IsString } from 'class-validator';
import { BookStatus } from '../constants/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryBookDto {
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
}
