import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Rating } from 'src/modules/rating/entities/rating.entity';
import { Author } from 'src/modules/author/entities/author.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';

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

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: [] })
  categories: string[];

  @Field(() => Float)
  @Column({ type: 'real', nullable: false })
  price: number;

  @Field(() => Float)
  @Column({ type: 'real', default: 0 })
  sale: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  currency: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  is_recommended: boolean;

  @Field(() => Int)
  @Column({ type: 'integer', default: 0 })
  buy_count: number;

  @Field(() => [Author])
  @ManyToMany(() => Author, (author) => author.books)
  authors: Author[];

  @Field(() => [Rating])
  @OneToMany(() => Rating, (rating) => rating.book)
  ratings?: Rating[];

  @ManyToMany(() => Cart, (cart) => cart.books)
  carts?: Cart[];
}
