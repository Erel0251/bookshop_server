import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

// import { CreateCartDto } from './dto/create-cart.dto';
// import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartItemRepository: Repository<Cart>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<void | Error> {
    const cartExist = await this.cartItemRepository.findOne({
      where: {
        user: { id: createCartDto.user_id },
        books: { id: createCartDto.book_id },
      },
    });
    if (cartExist) {
      cartExist.quantity += createCartDto.quantity;
      await this.cartItemRepository.save(cartExist);
    } else {
      await this.cartItemRepository.save(createCartDto);
    }
  }

  async update(updateCartDto: UpdateCartDto): Promise<void | Error> {
    const cartExist = await this.cartItemRepository.findOne({
      where: {
        user: { id: updateCartDto.user_id },
        books: { id: updateCartDto.book_id },
      },
    });
    if (cartExist) {
      if (updateCartDto.quantity === 0) {
        await this.cartItemRepository.remove(cartExist);
      } else if (updateCartDto.quantity > 0) {
        cartExist.quantity =
          updateCartDto.update_type === 'Append'
            ? cartExist.quantity + updateCartDto.quantity
            : updateCartDto.quantity;
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
