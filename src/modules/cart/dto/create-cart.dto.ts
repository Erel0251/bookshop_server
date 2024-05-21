import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsString()
  @ApiProperty()
  user_id: string;

  @IsString()
  @ApiProperty()
  book_id: string;
}
