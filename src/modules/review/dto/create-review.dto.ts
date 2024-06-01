import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  comment: string;

  @IsNumber()
  @ApiProperty()
  rating: number;

  @IsUUID()
  @ApiPropertyOptional()
  book_id?: string;

  @IsUUID()
  @ApiPropertyOptional()
  user_id?: string;

  id: string;
}
