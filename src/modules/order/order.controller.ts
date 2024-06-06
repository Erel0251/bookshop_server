import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/constants/role.enum';
import { QueryOrderDto } from './dto/query-order.dto';

@ApiTags('Order')
@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create a new order
  @Post()
  @Roles(Role.USER, Role.ADMIN)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  // Get all orders
  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() req: QueryOrderDto, @Res() res: any) {
    const query = new QueryOrderDto(req);
    const orders = await this.orderService.findAll(query);
    res.status(HttpStatus.OK).render('order', {
      title: 'Order',
      orders: orders,
      limit: query.limit,
      offset: query.offset,
      total: orders.length,
    });
  }

  // Get an order by id
  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  // Update status of an order
  @Patch(':id')
  @Roles(Role.USER, Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: any,
  ) {
    await this.orderService.updateStatusOrder(id, updateOrderDto);
    res.status(HttpStatus.OK).send({ message: 'Update status successfully' });
  }
}
