import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumberString, IsString } from 'class-validator';
import { CommonDto } from '../../../shared/dto/common.dto';
export class QuerySupplementDto extends CommonDto {
  @IsString()
  @ApiPropertyOptional()
  readonly name?: string;

  @IsString()
  @ApiPropertyOptional()
  readonly supplier?: string;

  @IsDate()
  @ApiPropertyOptional()
  readonly date?: Date;

  @IsNumberString()
  @ApiPropertyOptional()
  readonly month?: string;

  @IsNumberString()
  @ApiPropertyOptional()
  readonly year?: string;

  @IsString()
  @ApiPropertyOptional()
  readonly orderByName?: string = 'updated_at';

  constructor(partial: Partial<QuerySupplementDto>) {
    super();
    Object.assign(this, partial);
  }
}
