import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @ApiProperty({ type: 'string' })
  username: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ type: 'string', format: 'password' })
  password: string;
}
