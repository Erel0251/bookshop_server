import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueDto } from './dto/revenue.dto';
import { GraphData } from './dto/graph.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../user/constants/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('revenue')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
  @Roles(Role.ADMIN)
  async getRevenue(@Res() res: any) {
    const data: RevenueDto = await this.revenueService.getRevenue();
    const graph: GraphData = await this.revenueService.getGraphData();
    console.log(data);
    res.status(HttpStatus.OK).render('revenue', {
      title: 'Revenue',
      message: 'Get revenue successfully',
      data,
      graph,
    });
  }
}
