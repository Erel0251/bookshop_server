import { Field, ObjectType } from '@nestjs/graphql';
import { Book } from 'src/modules/book/entities/book.entity';
import { CommonEntity } from 'src/shared/entites/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Category extends CommonEntity {
  @Field()
  @Column({ type: 'text', nullable: false })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Book, (book) => book.categories, { nullable: true })
  @JoinColumn({ name: 'book_id' })
  book?: Book;

  @Field(() => [Category], { nullable: true })
  @OneToMany(() => Category, (category) => category.id, { nullable: true })
  children: Category[];
}
