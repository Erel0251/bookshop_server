import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';

// import { CreateCartDto } from './dto/create-cart.dto';
// import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartItemRepository: Repository<Cart>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
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
    } else {
      const item = await this.cartItemRepository.create(updateCartDto);
      const book = await this.bookRepository.findOne({
        where: { id: updateCartDto.book_id },
      });
      const user = await this.userRepository.findOne({
        where: { id: updateCartDto.user_id },
      });
      item.books = book;
      item.user = user;
      await this.cartItemRepository.save(item);
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

  async clearCart(userId: string): Promise<void | Error> {
    const cartList = await this.cartItemRepository.find({
      where: { user: { id: userId } },
    });
    if (cartList.length > 0) {
      await this.cartItemRepository.remove(cartList);
    }
  }
}
