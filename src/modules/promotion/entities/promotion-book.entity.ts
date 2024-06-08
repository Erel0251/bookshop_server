import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Book } from 'src/modules/book/entities/book.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Promotion } from './promotion.entity';

@Entity({ name: 'promotion_book' })
@ObjectType()
export class PromotionBook extends CommonEntity {
  @Field({ nullable: true })
  @Column({ type: 'integer', nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  @Column({ type: 'real', nullable: true })
  price: number;

  @Field({ nullable: true })
  @Column({ type: 'real', nullable: true })
  discount: number;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotion_books)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @ManyToOne(() => Book, (book) => book.promotion_books)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
