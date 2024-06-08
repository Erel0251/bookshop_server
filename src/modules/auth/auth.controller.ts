import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDto, @Res() res: any) {
    try {
      const result = await this.authService.signUp(signUpDto);
      res
        .status(HttpStatus.CREATED)
        .cookie('accessToken', result.tokens.accessToken, {
          httpOnly: true,
        })
        .cookie('refreshToken', result.tokens.refreshToken, {
          httpOnly: true,
        })
        .send(result);
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'User already exists' });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    try {
      const result = await this.authService.login(loginDto);
      res
        .status(HttpStatus.OK)
        .cookie('accessToken', result.tokens.accessToken, {
          httpOnly: true,
        })
        .cookie('refreshToken', result.tokens.refreshToken, {
          httpOnly: true,
        })
        .send(result);
    } catch (error) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: 'Invalid email or password' });
    }
  }

  @Get('logout')
  async logout(@Req() email: string, @Res() res: any) {
    //await this.authService.logout(email);
    res
      .status(HttpStatus.OK)
      .clearCookie('accessToken', { httpOnly: true })
      .clearCookie('refreshToken', { httpOnly: true })
      .redirect('/');
  }
}
