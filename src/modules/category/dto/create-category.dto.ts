import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString, IsUUID } from 'class-validator';

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

  @IsArray()
  @ApiPropertyOptional({ type: () => [CreateCategoryDto] })
  children?: CreateCategoryDto[];
}
