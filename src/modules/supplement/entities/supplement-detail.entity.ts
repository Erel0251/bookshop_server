import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Supplement } from './supplement.entity';
import { Book } from 'src/modules/book/entities/book.entity';

@Entity()
export class SupplementDetail extends CommonEntity {
  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({ default: 'VND' })
  currency: string;

  @ManyToOne(() => Supplement, (supplement) => supplement.supplement_details)
  @JoinColumn({ name: 'supplement_id' })
  supplements: Supplement;

  @ManyToOne(() => Book, (book) => book.supplement_details)
  @JoinColumn({ name: 'book_id' })
  books: Book;
}
