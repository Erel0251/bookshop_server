import { Injectable } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CartService } from '../cart/cart.service';
import { CreateCartDto } from '../cart/dto/create-cart.dto';
import { UpdateCartDto } from '../cart/dto/update-cart.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly cartService: CartService,
  ) {}

  async findAll(): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');
    query
      .leftJoinAndSelect('user.orders', 'orders')
      .leftJoinAndSelect('orders.order_details', 'order_details')
      .leftJoinAndSelect('user.reviews', 'reviews')
      .groupBy('user.id')
      .select('user')
      .addSelect('COUNT(orders.id)', 'order_count')
      .addSelect(
        `SUM(CASE WHEN orders.status = 'CONFIRMED' THEN order_details.total_price ELSE 0 END)`,
        'total_spent',
      )
      .addSelect('COUNT(reviews.id)', 'review_count')
      .addSelect('ROUND(AVG(reviews.rating), 2)', 'average_rating');
    return await query.getRawMany();
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email: Equal(email) },
    });
  }

  async findOneById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ email }, updateUserDto);
  }

  async remove(email: string) {
    return await this.userRepository.delete({ email });
  }

  async getCart(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: [
        'cart_items',
        'cart_items.books',
        'cart_items.books.promotion_books',
      ],
    });
  }

  async addBookToCart(userId: string, cartItem: CreateCartDto) {
    cartItem.user_id = userId;
    return await this.cartService.create(cartItem);
  }

  async updateCartItem(product: UpdateCartDto) {
    // get list of cart items of user
    await this.cartService.update(product);
  }

  async removeCartItem(userId: string, bookId: string) {
    return await this.cartService.remove(userId, bookId);
  }

  async getOrder(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: [
        'orders',
        'orders.order_details',
        'orders.order_details.books',
      ],
    });
  }
}
