import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsArray()
  @ApiPropertyOptional()
  children?: CreateCategoryDto[];
}
