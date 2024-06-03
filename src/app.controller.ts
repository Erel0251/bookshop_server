import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import * as fs from 'fs';

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

  @Get('about')
  about(@Res() res: any) {
    let data = undefined;
    try {
      data = fs.readFileSync('public/about.txt', 'utf8');
    } catch (err) {
      console.error(err);
    }
    res.render('about', { message: 'About page', title: 'About', data: data });
  }

  // for user get
  @Get('about/view')
  aboutView(@Res() res: any) {
    let data = 'Blank data';
    try {
      data = fs.readFileSync('public/about.txt', 'utf8');
    } catch (err) {
      console.error(err);
    }
    res.status(HttpStatus.OK).send(data);
  }

  @Post('about')
  postAbout(@Body() req: any, @Res() res: any) {
    console.log(req);
    console.log(req.editordata);
    fs.writeFileSync('public/about.txt', req.editordata);
    res.status(HttpStatus.OK).redirect('about');
  }
}
