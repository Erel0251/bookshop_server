import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(@Res() res: any) {
    return res.render('login', { message: 'Hello world!', title: 'Login' });
  }
}
