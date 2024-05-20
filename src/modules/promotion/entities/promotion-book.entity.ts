import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Book } from 'src/modules/book/entities/book.entity';
import { ObjectType } from '@nestjs/graphql';
import { Promotion } from './promotion.entity';

@Entity({ name: 'promotion_book' })
@ObjectType()
export class PromotionBook extends CommonEntity {
  @Column({ type: 'integer', nullable: true })
  quantity?: number;

  @Column({ type: 'integer', nullable: true })
  price: number;

  @Column({ type: 'integer', nullable: true })
  discount: number;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotion_books)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @ManyToOne(() => Book, (book) => book.promotion_books)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
