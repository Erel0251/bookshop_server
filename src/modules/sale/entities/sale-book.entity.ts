import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Sale } from './sale.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { ObjectType } from '@nestjs/graphql';

@Entity({ name: 'sale_book' })
@ObjectType()
export class SaleBook extends CommonEntity {
  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @Column({ type: 'integer', default: 0 })
  price: number;

  @Column({ type: 'integer', default: 0 })
  discount: number;

  @ManyToOne(() => Sale, (sale) => sale.sale_books)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Book, (book) => book.sale_books)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
