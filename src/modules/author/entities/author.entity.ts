import { Book } from 'src/modules/book/entities/book.entity';
import { CommonEntity } from '../../../shared/entites/common.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity({ name: 'author' })
export class Author extends CommonEntity {
  @Column({ type: 'text', nullable: false })
  last_name: string;

  @Column({ type: 'text', nullable: false })
  first_name: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable({
    name: 'author_book_details',
    joinColumn: { name: 'author_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'book_id', referencedColumnName: 'id' },
  })
  books: Book[];
}
