import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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

  @IsString()
  @ApiProperty()
  book_id: string;

  @IsString()
  @ApiProperty()
  user_id: string;
}
