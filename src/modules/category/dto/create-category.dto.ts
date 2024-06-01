import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsBoolean()
  @ApiPropertyOptional()
  is_published?: boolean;

  @IsUUID()
  @ApiPropertyOptional()
  father_id?: string;

  @IsObject()
  @ApiPropertyOptional()
  father?: CreateCategoryDto;

  @IsArray()
  @ApiPropertyOptional({ type: () => [CreateCategoryDto] })
  children?: CreateCategoryDto[];

  id: string;
}
