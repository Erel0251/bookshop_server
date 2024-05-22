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

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (book) => book.category, { nullable: true })
  books?: Book[];

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'father_id' })
  father?: Category;

  @Field(() => [Category], { nullable: true })
  @OneToMany(() => Category, (category) => category.father, { nullable: true })
  children?: Category[];
}
