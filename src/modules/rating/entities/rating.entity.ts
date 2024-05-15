import { Book } from 'src/modules/book/entities/book.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'rating' })
export class Rating extends CommonEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => Book, (book) => book.ratings)
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  book: Book;
}
