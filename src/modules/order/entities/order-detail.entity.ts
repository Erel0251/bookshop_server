import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Book } from 'src/modules/book/entities/book.entity';
import { Order } from './order.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';

@Entity()
export class OrderDetail extends CommonEntity {
  @Column({ type: 'real', nullable: false })
  price: number;

  @Column({ type: 'real', default: 0 })
  discount: number;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @Column({ type: 'real', nullable: false })
  total_price: number;

  @ManyToOne(() => Order, (order) => order.order_details)
  @JoinColumn({ name: 'order_id' })
  orders: Order;

  @ManyToOne(() => Book, (book) => book.order_details)
  @JoinColumn({ name: 'book_id' })
  books: Book;
}
