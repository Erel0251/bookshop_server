import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { CommonEntity } from 'src/shared/entites/common.entity';
import { Rating } from 'src/modules/rating/entities/rating.entity';
import { Author } from 'src/modules/author/entities/author.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Sale } from 'src/modules/sale/entities/sale.entity';
import { OrderDetail } from 'src/modules/order/entities/order-detail.entity';

import { Status } from '../constants/status.enum';
import { CartDetail } from 'src/modules/cart/entities/cart-detail.entity';
import { SupplementDetail } from 'src/modules/supplement/entities/supplement-detail.entity';

@Entity()
@ObjectType()
export class Book extends CommonEntity {
  @Field()
  @Column({ type: 'text', nullable: false, unique: true })
  title: string;

  @Field()
  @Column({ type: 'text', nullable: false })
  publisher: string;

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: [] })
  img_urls: string[];

  @Field()
  @Column({ type: 'text' })
  overview: string;

  @Field()
  @Column({ type: 'char', length: 13, nullable: false })
  isbn: string;

  @Field(() => Float)
  @Column({ type: 'real', nullable: false })
  price: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  status: Status;

  @Field()
  @Column({ type: 'text', nullable: false })
  currency: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  is_recommended: boolean;

  @Field(() => Int)
  @Column({ type: 'integer', default: 0 })
  buy_count: number;

  @Field(() => Int)
  @Column({ type: 'integer', default: 0 })
  inventory: number;

  @Field(() => [Category])
  @OneToMany(() => Category, (category) => category.book)
  categories: Category[];

  @Field(() => [Author])
  @ManyToMany(() => Author, (author) => author.books)
  authors: Author[];

  @Field(() => [Rating])
  @OneToMany(() => Rating, (rating) => rating.book)
  ratings?: Rating[];

  @OneToMany(() => Sale, (sale) => sale.books)
  sale?: Sale[];

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.books)
  cart_details?: CartDetail[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.books)
  order_details?: OrderDetail[];

  @OneToMany(
    () => SupplementDetail,
    (supplementDetail) => supplementDetail.books,
  )
  supplement_details?: SupplementDetail[];
}
