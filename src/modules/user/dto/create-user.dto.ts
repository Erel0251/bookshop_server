import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ type: 'string', description: 'Name of the user' })
  name: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    type: 'string',
    format: 'email',
    description: 'Email of the user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'password',
    description: 'Password of the user',
  })
  password: string;

  @IsString()
  @ApiProperty()
  refreshToken: string;
}
