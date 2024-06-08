import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueDto } from './dto/revenue.dto';
import { GraphData } from './dto/graph.dto';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
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
