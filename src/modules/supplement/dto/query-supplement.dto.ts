import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumberString, IsString } from 'class-validator';
export class QuerySupplementDto {
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
}
