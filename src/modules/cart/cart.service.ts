import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

// import { CreateCartDto } from './dto/create-cart.dto';
// import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartItemRepository: Repository<Cart>,
  ) {}
  async create(
    userId: string,
    bookId: string,
    quantity: number = 1,
  ): Promise<void | Error> {
    const cartExist = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, books: { id: bookId } },
    });
    if (cartExist) {
      cartExist.quantity += quantity;
      await this.cartItemRepository.save(cartExist);
    } else {
      await this.cartItemRepository.save({
        user: { id: userId },
        books: { id: bookId },
        quantity,
      });
    }
  }

  async update(
    userId: string,
    bookId: string,
    quantity: number,
  ): Promise<void | Error> {
    const cartExist = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, books: { id: bookId } },
    });
    if (cartExist) {
      if (quantity === 0) {
        await this.cartItemRepository.remove(cartExist);
      } else if (quantity > 0) {
        cartExist.quantity = quantity;
        await this.cartItemRepository.save(cartExist);
      } else {
        throw new Error('Quantity must be greater than 0');
      }
    }
  }

  async remove(userId: string, bookId: string): Promise<void | Error> {
    const cartExist = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, books: { id: bookId } },
    });
    if (cartExist) {
      await this.cartItemRepository.remove(cartExist);
    }
  }
}
