import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @ApiProperty()
  last_name: string;

  @IsString()
  @ApiProperty()
  first_name: string;

  @IsString()
  @ApiPropertyOptional()
  bio?: string;

  @IsString()
  @ApiPropertyOptional()
  img_url?: string;

  @IsArray()
  @ApiPropertyOptional()
  books?: any[];
}
