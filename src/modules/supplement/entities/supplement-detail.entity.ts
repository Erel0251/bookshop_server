import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Supplement } from './supplement.entity';
import { Book } from 'src/modules/book/entities/book.entity';

@Entity()
export class SupplementDetail extends CommonEntity {
  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  currency: string;

  @ManyToOne(() => Supplement, (supplement) => supplement.supplement_details)
  supplements: Supplement;

  @ManyToOne(() => Book, (book) => book.supplement_details)
  books: Book;
}
