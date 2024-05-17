import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { SaleBook } from './sale-book.entity';

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

  @OneToMany(() => SaleBook, (saleBook) => saleBook.sale)
  sale_books: SaleBook[];
}
