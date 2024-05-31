import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { BookStatus } from '../constants/status.enum';
import { UpdateCategoryDto } from '../../category/dto/update-category.dto';
import { UpdateAuthorDto } from '../../author/dto/update-author.dto';
import { UpdateReviewDto } from '../../review/dto/update-review.dto';
import { CreateSupplementDetailDto } from '../../supplement/dto/create-supplement-detail.dto';

export class CreateBookDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiPropertyOptional()
  author?: string;

  @IsString()
  @ApiProperty()
  publisher: string;

  @IsString({ each: true })
  @IsArray()
  @ApiProperty({ type: [String] })
  img_urls: string[];

  @IsString()
  @ApiPropertyOptional()
  overview?: string;

  @IsString()
  @ApiPropertyOptional()
  isbn?: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsString()
  @ApiProperty()
  status: BookStatus;

  @IsString()
  @ApiProperty({ default: 'VND' })
  currency: string;

  @IsBoolean()
  @ApiPropertyOptional({ default: false })
  is_recommended?: boolean;

  @IsNumber()
  @ApiPropertyOptional({ default: 0 })
  inventory?: number;

  @IsString()
  @ApiPropertyOptional()
  category_id?: string;

  keyword: string;

  @IsArray()
  @ApiPropertyOptional({ type: () => UpdateCategoryDto })
  categories?: UpdateCategoryDto;

  @IsArray()
  @ApiPropertyOptional({ type: () => [UpdateAuthorDto] })
  authors?: UpdateAuthorDto[];

  @IsArray()
  @ApiPropertyOptional({ type: () => [UpdateReviewDto] })
  review?: UpdateReviewDto[];

  @IsArray()
  @ApiPropertyOptional({ type: () => CreateSupplementDetailDto })
  supplement_detail?: CreateSupplementDetailDto;
}
