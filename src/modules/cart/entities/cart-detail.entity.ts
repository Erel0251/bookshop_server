import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Book } from 'src/modules/book/entities/book.entity';
import { Cart } from './cart.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';

@Entity()
export class CartDetail extends CommonEntity {
  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cart_details)
  @JoinColumn({ name: 'cart_id' })
  carts: Cart;

  @ManyToOne(() => Book, (book) => book.cart_details)
  @JoinColumn({ name: 'book_id' })
  books: Book;
}
