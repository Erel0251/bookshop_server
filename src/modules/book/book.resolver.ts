import {
  Args,
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';
import { Category } from '../category/entities/category.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { Review } from '../review/entities/review.entity';
import { QueryBookDto } from './dto/query-book.dto';
import { Order } from '../../shared/constants/order.enum';

@ObjectType()
class BooksResponse {
  @Field(() => Int)
  total: number;

  @Field(() => [Book])
  data: Book[];
}

@Resolver(() => Book)
export class BookResolver {
  constructor(private bookService: BookService) {}

  @Query(() => BooksResponse, { name: 'books' })
  async books(
    @Args('search', { type: () => String, nullable: true })
    search: string,
    @Args('category', { type: () => String, nullable: true })
    category: string,
    @Args('rating', { type: () => Number, nullable: true })
    rating: number,
    @Args('fromPrice', { type: () => Number, nullable: true })
    fromPrice: number,
    @Args('toPrice', { type: () => Number, nullable: true })
    toPrice: number,
    @Args('offset', { type: () => Number, nullable: true, defaultValue: 0 })
    offset: number,
    @Args('limit', { type: () => Number, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('sortBy', {
      type: () => String,
      nullable: true,
      defaultValue: 'updated_at',
    })
    sortBy: string,
    @Args('order', {
      type: () => String,
      nullable: true,
      defaultValue: Order.DESC,
    })
    order: Order,
  ): Promise<BooksResponse> {
    const query = new QueryBookDto({
      keyword: search,
      category,
      rating,
      fromPrice,
      toPrice,
      offset,
      limit,
      sortBy,
      order,
    });
    const data = await this.bookService.findAll(query);
    const total = await this.bookService.getCountTotal();
    return { total, data };
  }

  @Query(() => Book, { name: 'book' })
  async book(@Args('id', ParseUUIDPipe) id: string): Promise<Book> {
    return await this.bookService.findOne(id);
  }

  @ResolveField(() => Category, { name: 'category', nullable: true })
  async category(@Parent() book: Book): Promise<Category> {
    return await this.bookService.findCategoryByBookId(book.id);
  }

  @ResolveField(() => [Review], { name: 'reviews', nullable: true })
  async reviews(@Parent() book: Book): Promise<Review[]> {
    return await this.bookService.findReviewByBook(book.id);
  }

  @ResolveField(() => ID, { name: 'id' })
  resolveId(@Parent() book: Book): string {
    return book.id;
  }

  @ResolveField(() => Float, { name: 'sale_price', nullable: true })
  async salePrice(@Parent() book: Book): Promise<number> {
    return await this.bookService.getCurrentSalePrice(book);
  }
}
