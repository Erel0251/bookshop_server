import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { validStatusTransition } from './helpers/helpers';
import { BookService } from '../book/book.service';
import { QueryOrderDto } from './dto/query-order.dto';
import { User } from '../user/entities/user.entity';
import { OrderStatus } from './constants/order-status.enum';
import { BookStatus } from '../book/constants/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(OrderService.name);

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderRepository.create(createOrderDto);
    const user = await this.userRepository.findOne({
      where: { id: createOrderDto.user_id },
    });
    order.user = user;
    await this.orderRepository.save(order);
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

  async findAll(req: QueryOrderDto): Promise<Order[]> {
    // case value order by status
    // with order pending, confirmed, delivering, delivered, canceled
    const query = this.orderRepository.createQueryBuilder('order');
    if (req.name) {
      query.andWhere('order.name LIKE :name', { name: `%${req.name}%` });
    }

    if (req.email) {
      query.andWhere('order.email LIKE :email', { email: `%${req.email}%` });
    }

    if (req.phone) {
      query.andWhere('order.phone LIKE :phone', { phone: `%${req.phone}%` });
    }

    if (req.date) {
      query.andWhere('order.update_at::text LIKE :date', {
        date: `%${req.date}%`,
      });
    }

    if (req.status) {
      query.andWhere('order.status LIKE :status', {
        status: `%${req.status.toUpperCase()}%`,
      });
    } else {
      query.orderBy(
        `CASE
          WHEN order.status = 'PENDING' THEN 1
          WHEN order.status = 'CONFIRMED' THEN 2
          WHEN order.status = 'DELIVERING' THEN 3
          WHEN order.status = 'DELIVERED' THEN 4
          WHEN order.status = 'CANCELLED' THEN 5
          ELSE 6
        END`,
        'ASC',
      );
    }

    query
      .leftJoinAndSelect('order.order_details', 'order_details')
      // get book name and id
      .leftJoinAndSelect('order_details.books', 'book');
    return await query.getMany();
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
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['order_details', 'order_details.books'],
    });
    if (!order) {
      return new Error('Order not found');
    }

    if (!validStatusTransition(order.status, updateOrderDto.status)) {
      return new Error('Invalid status transition');
    }

    order.status = updateOrderDto.status;

    if (updateOrderDto.status === OrderStatus.CONFIRMED) {
      order.order_details.map(async (orderDetail) => {
        const book = await this.bookService.findOne(orderDetail.books.id);
        // assuming that the quantity of the book is enough
        // if (book.quantity < orderDetail.quantity) {
        //   return new Error('Not enough book quantity');
        // }
        book.inventory -= orderDetail.quantity;
        if (book.inventory === 0) {
          book.status = BookStatus.OUT_OF_STOCK;
        }
        await this.bookService.update(book.id, book);
      });
    }

    return await this.orderRepository.save(order);
  }
}
