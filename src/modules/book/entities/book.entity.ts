import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Rating } from 'src/modules/rating/entities/rating.entity';
import { CommonEntity } from '../../../shared/entites/common.entity';
import { Author } from 'src/modules/author/entities/author.entity';

@Entity()
export class Book extends CommonEntity {
  @Column({ type: 'text', nullable: false, unique: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  publisher: string;

  @Column({ type: 'text', array: true, default: [] })
  img_urls: string[];

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text' })
  overview: string;

  @Column({ type: 'char', length: 13, nullable: false })
  isbn: string;

  @Column({ type: 'text', array: true, default: [] })
  categories: string[];

  @Column({ type: 'real', nullable: false })
  price: number;

  @Column({ type: 'real', default: 0 })
  sale: number;

  @Column({ type: 'text', nullable: false })
  currency: string;

  @Column({ type: 'boolean', default: false })
  is_recommended: boolean;

  @Column({ type: 'integer', default: 0 })
  buy_count: number;

  @ManyToMany(() => Author, (author) => author.books)
  authors: Author[];

  @OneToMany(() => Rating, (rating) => rating.book)
  ratings: Rating[];

  @ManyToMany(() => Cart, (cart) => cart.books)
  carts: Cart[];
}
