import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { CommonEntity } from 'src/shared/entites/common.entity';
import { BookStatus } from '../constants/status.enum';

import { Category } from 'src/modules/category/entities/category.entity';
import { OrderDetail } from 'src/modules/order/entities/order-detail.entity';
import { SupplementDetail } from 'src/modules/supplement/entities/supplement-detail.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Review } from '../../review/entities/review.entity';
import { PromotionBook } from '../../promotion/entities/promotion-book.entity';

@Entity()
@ObjectType()
export class Book extends CommonEntity {
  @Field()
  @Column({ type: 'text', nullable: false, unique: true })
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  author?: string;

  @Field()
  @Column({ type: 'text', nullable: false })
  publisher: string;

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: [] })
  img_urls: string[];

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  overview?: string;

  @Field()
  @Column({ type: 'char', length: 13, nullable: false })
  isbn: string;

  @Field(() => Float)
  @Column({ type: 'real', nullable: false })
  price: number;

  @Field()
  @Column({ type: 'text', default: BookStatus.COMING_SOON })
  status: BookStatus;

  @Field()
  @Column({ type: 'text', nullable: false })
  currency: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  is_recommended: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Field()
  @Column({ type: 'text', nullable: true })
  keyword?: string;

  @Field(() => Int)
  @Column({ type: 'integer', default: 0 })
  buy_count: number;

  @Field(() => Int)
  @Column({ type: 'integer', default: 0 })
  inventory: number;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.books)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // @Field(() => [Author])
  // @ManyToMany(() => Author, (author) => author.books)
  // authors: Author[];

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.book)
  reviews?: Review[];

  @OneToMany(() => PromotionBook, (promotionBook) => promotionBook.book)
  promotion_books?: PromotionBook[];

  @OneToMany(() => Cart, (cart) => cart.books)
  cart_items?: Cart[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.books)
  order_details?: OrderDetail[];

  @OneToMany(
    () => SupplementDetail,
    (supplementDetail) => supplementDetail.books,
  )
  supplement_details?: SupplementDetail[];
}
