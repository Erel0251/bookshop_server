import { Field, ObjectType } from '@nestjs/graphql';
import { Book } from 'src/modules/book/entities/book.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Sale extends CommonEntity {
  @Field()
  @Column({ type: 'text', nullable: false })
  name: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field()
  @Column({ type: 'date', nullable: true })
  from: Date;

  @Field()
  @Column({ type: 'date', nullable: true })
  to: Date;

  @Field(() => [Book])
  @ManyToOne(() => Book, (book) => book.sale)
  @JoinColumn({ name: 'book_id' })
  books: Book;
}
