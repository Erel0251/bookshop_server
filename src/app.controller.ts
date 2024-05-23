import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(@Res() res: any) {
    return res.render('temp', { message: 'Hello world!' });
  }
}
