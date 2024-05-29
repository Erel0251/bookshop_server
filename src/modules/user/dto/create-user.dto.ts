import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumberString, IsString } from 'class-validator';
import { Role } from '../constants/role.enum';

export class CreateUserDto {
  @IsString()
  @ApiPropertyOptional()
  first_name?: string;

  @IsString()
  @ApiPropertyOptional()
  last_name?: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    type: 'string',
    format: 'email',
    description: 'Email of the user',
  })
  email: string;

  @IsNumberString()
  @ApiPropertyOptional()
  phone?: string;

  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
    description: 'Role of the user',
  })
  role: Role;

  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'password',
    description: 'Password of the user',
  })
  password: string;

  @IsString()
  @ApiPropertyOptional()
  refreshToken?: string;
}
