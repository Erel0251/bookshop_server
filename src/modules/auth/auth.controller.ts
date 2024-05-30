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
    const token = await this.authService.signUp(signUpDto);
    res
      .status(HttpStatus.CREATED)
      .cookie('accessToken', token.accessToken, {
        httpOnly: true,
      })
      .cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
      })
      .send(token);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const token = await this.authService.login(loginDto);
    res
      .status(HttpStatus.OK)
      .cookie('accessToken', token.accessToken, {
        httpOnly: true,
      })
      .cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
      })
      .send(token);
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
