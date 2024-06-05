import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { validStatusTransition } from './helpers/helpers';
import { BookService } from '../book/book.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,

    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(OrderService.name);

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderRepository.save(createOrderDto);
    if (createOrderDto.order_details) {
      createOrderDto.order_details.forEach(async (orderDetail) => {
        const detail = await this.orderDetailRepository.create(orderDetail);
        const book = await this.bookService.findOne(orderDetail.book_id);
        detail.books = book;
        detail.orders = order;
        await this.orderDetailRepository.save(detail);
      });
    }
    return;
  }

  async findAll(): Promise<Order[]> {
    // case value order by status
    // with order pending, confirmed, delivering, delivered, canceled
    return await this.orderRepository
      .createQueryBuilder('order')
      .orderBy(
        `CASE
          WHEN order.status = 'PENDING' THEN 1
          WHEN order.status = 'CONFIRMED' THEN 2
          WHEN order.status = 'DELIVERING' THEN 3
          WHEN order.status = 'DELIVERED' THEN 4
          WHEN order.status = 'CANCELED' THEN 5
          ELSE 6
        END`,
        'ASC',
      )
      .leftJoinAndSelect('order.order_details', 'order_details')
      // get book name and id
      .leftJoinAndSelect('order_details.books', 'book')
      .getMany();
  }

  async findOne(id: string): Promise<Order | Error> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_details', 'order_details.book'],
      });

      if (!order) {
        return new Error('Order not found');
      }
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  // TODO: BUSSINESS LOGIC
  async updateStatusOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order | Error> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      return new Error('Order not found');
    }

    if (!validStatusTransition(order.status, updateOrderDto.status)) {
      return new Error('Invalid status transition');
    }

    order.status = updateOrderDto.status;

    return await this.orderRepository.save(order);
  }
}
