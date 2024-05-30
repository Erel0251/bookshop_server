import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/shared/entites/common.entity';

@Entity({ name: 'author' })
@ObjectType()
export class Author extends CommonEntity {
  @Field()
  @Column({ type: 'text', nullable: false })
  last_name: string;

  @Field()
  @Column({ type: 'text', nullable: false })
  first_name: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  img_url?: string;

  // @Field(() => [Book])
  // @ManyToMany(() => Book, (book) => book.authors)
  // @JoinTable({
  //   name: 'author_book_details',
  //   joinColumn: { name: 'author_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'book_id', referencedColumnName: 'id' },
  // })
  // books: Book[];
}
