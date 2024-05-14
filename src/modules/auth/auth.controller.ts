import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<object | Error> {
    return await this.authService.login(loginDto);
  }

  @Get('logout')
  async logout(@Req() email: string) {
    return await this.authService.logout(email);
  }

  @Get('refresh')
  refresh() {}

  @Get('users')
  getUsers() {}

  @Get('users/:id')
  getUser() {}

  @Patch('users/:id')
  updateUser() {}
}
