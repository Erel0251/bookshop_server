import { User } from 'src/modules/user/entities/user.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Book } from 'src/modules/book/entities/book.entity';

@Entity({ name: 'cart_item' })
export class Cart extends CommonEntity {
  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @ManyToOne(() => User, (user) => user.cart_items)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, (book) => book.cart_items)
  @JoinColumn({ name: 'book_id' })
  books: Book;
}
