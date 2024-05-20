import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { PromotionBook } from './promotion-book.entity';
import { PromotionType } from '../constants/promotion-type.enum';

@Entity()
@ObjectType()
export class Promotion extends CommonEntity {
  @Field()
  @Column({ type: 'text', nullable: false })
  name: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field()
  @Column({ default: PromotionType.SALE })
  type: PromotionType;

  @Field()
  @Column({ type: 'date', nullable: true })
  from: Date;

  @Field()
  @Column({ type: 'date', nullable: true })
  to: Date;

  @Field()
  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @OneToMany(() => PromotionBook, (promotionBook) => promotionBook.promotion)
  promotion_books: PromotionBook[];
}
