import { Controller, Get, Res } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('supplements')
  root(@Res() res: any) {
    return res.render('pages/supplements', { message: 'Hello world!' });
  }

  @Get('admin')
  admin(@Res() res: any) {
    return res.render('admin', { message: 'Hello Admin!' });
  }
}
