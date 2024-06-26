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
import { Roles } from './modules/auth/decorators/roles.decorator';
import { Role } from './modules/user/constants/role.enum';

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
    res.render('about', { message: 'About page', title: 'About', data });
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
  @Roles(Role.ADMIN)
  postAbout(@Body() req: any, @Res() res: any) {
    fs.writeFileSync('public/about.txt', req.editordata);
    res.status(HttpStatus.OK).send({ message: 'About page updated' });
  }
}
