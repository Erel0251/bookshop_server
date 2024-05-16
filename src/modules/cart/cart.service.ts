import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartDetail } from './entities/cart-detail.entity';

// import { CreateCartDto } from './dto/create-cart.dto';
// import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(CartDetail)
    private cartDetailRepository: Repository<CartDetail>,
  ) {}
  async addBookToCart(
    cartId: string,
    bookId: string,
    quantity: number = 1,
  ): Promise<void | Error> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    const cartDetail = await this.cartDetailRepository.findOne({
      where: { carts: cart, books: { id: bookId } },
    });
    if (cartDetail) {
      cartDetail.quantity += quantity;
      await this.cartDetailRepository.save(cartDetail);
    } else {
      await this.cartDetailRepository.save({
        quantity,
        carts: cart,
        books: { id: bookId },
      });
    }
    await this.updateTotalPrice(cartId);
  }

  async removeBookFromCart(
    cartId: string,
    bookId: string,
  ): Promise<void | Error> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    const cartDetail = await this.cartDetailRepository.findOne({
      where: { carts: cart, books: { id: bookId } },
    });
    if (cartDetail) {
      await this.cartDetailRepository.remove(cartDetail);
    }
    await this.updateTotalPrice(cartId);
  }

  async updateBookQuantity(
    cartId: string,
    bookId: string,
    quantity: number,
  ): Promise<void | Error> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    const cartDetail = await this.cartDetailRepository.findOne({
      where: { carts: cart, books: { id: bookId } },
    });
    if (cartDetail) {
      // if quantity is 0, remove the book from cart
      // if quantity is greater than 0, update the quantity
      // if quantity is less than 0, return an error
      if (quantity === 0) {
        await this.cartDetailRepository.remove(cartDetail);
      } else if (quantity > 0) {
        cartDetail.quantity = quantity;
        await this.cartDetailRepository.save(cartDetail);
      } else {
        throw new Error('Quantity must be greater than or equal to 0');
      }
    }
    await this.updateTotalPrice(cartId);
  }

  async updateTotalPrice(cartId: string) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['cart_details', 'cart_details.books'],
    });
    cart.total_price = cart.cart_details.reduce(
      (total, cartDetail) =>
        total + cartDetail.quantity * cartDetail.books.price,
      0,
    );
    await this.cartRepository.save(cart);
  }
}
