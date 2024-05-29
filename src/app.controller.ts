import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(@Req() req: any, @Res() res: any) {
    if (!req.user) {
      res.redirect('login');
    } else {
      res.redirect('/book');
    }
  }

  @Get('login')
  login(@Res() res: any) {
    res.render('login', { message: 'Please login', title: 'Login' });
  }

  @Get('signup')
  signup(@Res() res: any) {
    res.render('signup', { message: 'Please signup', title: 'Signup' });
  }
}
