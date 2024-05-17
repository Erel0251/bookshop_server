import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';
import { Author } from '../author/entities/author.entity';
import { Rating } from '../rating/entities/rating.entity';
import { Category } from '../category/entities/category.entity';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => Book)
export class BookResolver {
  constructor(private bookService: BookService) {}

  @Query(() => [Book])
  async books(
    @Args('offset', { type: () => Number, nullable: true, defaultValue: 0 })
    offset: number,
    @Args('limit', { type: () => Number, nullable: true, defaultValue: 20 })
    limit: number,
  ): Promise<Book[]> {
    return await this.bookService.findAll(offset, limit);
  }

  @Query(() => Book, { name: 'book' })
  async book(@Args('id', ParseUUIDPipe) id: string): Promise<Book> {
    return await this.bookService.findOne(id);
  }

  @ResolveField(() => [Category], { name: 'categories' })
  async categories(@Parent() book: Book): Promise<Category[]> {
    return await this.bookService.findCategoryByBookId(book.id);
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
