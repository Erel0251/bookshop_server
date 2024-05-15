import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';
import { Author } from '../author/entities/author.entity';
import { Rating } from '../rating/entities/rating.entity';

@Resolver(() => Book)
export class BookResolver {
  constructor(private bookService: BookService) {}

  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return await this.bookService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  async book(@Args('id') id: string): Promise<Book> {
    return await this.bookService.findOne(id);
  }

  @ResolveField(() => [Author], { name: 'authors' })
  async authors(@Parent() book: Book): Promise<Author[]> {
    return await this.bookService.findAuthorByBookId(book.id);
  }

  @ResolveField(() => [Rating], { name: 'rating' })
  async rating(@Parent() book: Book): Promise<Rating[]> {
    return await this.bookService.findRatingByBookId(book.id);
  }
}
