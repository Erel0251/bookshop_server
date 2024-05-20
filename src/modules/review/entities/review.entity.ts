import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Book } from 'src/modules/book/entities/book.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'review' })
@ObjectType()
export class Review extends CommonEntity {
  @Field()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field()
  @Column({ type: 'text' })
  comment: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => Book, (book) => book.reviews)
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  book: Book;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
