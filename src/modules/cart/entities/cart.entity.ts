import { Book } from 'src/modules/book/entities/book.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'cart' })
export class Cart extends CommonEntity {
  @Column({ type: 'smallint', default: 0 })
  quantity: number;

  @Column({ type: 'real', default: 0 })
  total_price: number;

  @ManyToMany(() => Book, (book) => book.carts)
  @JoinTable({
    name: 'cart_book_details',
    joinColumn: { name: 'cart_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'book_id', referencedColumnName: 'id' },
  })
  books: Book[];

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
