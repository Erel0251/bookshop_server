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
import { QueryBookDto } from './dto/query-book.dto';
import { Order } from '../../shared/constants/order.enum';
import { ReviewResponse } from '../review/review.resolver';
import { QueryReviewDto } from '../review/dto/query-review.dto';

@ObjectType()
class BooksResponse {
  @Field(() => Int)
  total: number;

  @Field(() => [Book])
  data: Book[];
}

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => BooksResponse, { name: 'books' })
  async books(
    @Args('search', { type: () => String, nullable: true })
    search: string,
    @Args('categories', { type: () => [String], nullable: true })
    categories: string[],
    @Args('publishers', { type: () => [String], nullable: true })
    publishers: string[],
    @Args('rating', { type: () => Number, nullable: true })
    rating: number,
    @Args('fromPrice', { type: () => Number, nullable: true })
    fromPrice: number,
    @Args('toPrice', { type: () => Number, nullable: true })
    toPrice: number,
    @Args('type', { type: () => String, nullable: true })
    type: string,
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
      categories,
      publishers,
      type,
      rating,
      fromPrice,
      toPrice,
      offset,
      limit,
      sortBy,
      order,
    });
    const data = await this.bookService.findAll(query);
    const total = await this.bookService.getCountTotal(query);
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

  @Query(() => [String], { name: 'publishers' })
  async publishers(): Promise<string[]> {
    return await this.bookService.getPublisher();
  }

  @Query(() => [Book], { name: 'popular' })
  async popular(): Promise<Book[]> {
    const result = await this.bookService.findPopular();
    return result;
  }

  @ResolveField(() => ReviewResponse, { name: 'reviews', nullable: true })
  async reviews(
    @Parent() book: Book,
    @Args('rating', { type: () => Number, nullable: true })
    rating?: number,
    @Args('offset', { type: () => Number, nullable: true, defaultValue: 0 })
    offset?: number,
    @Args('limit', { type: () => Number, nullable: true, defaultValue: 10 })
    limit: number = 10,
    @Args('sortBy', {
      type: () => String,
      nullable: true,
      defaultValue: 'created_at',
    })
    sortBy: string = 'created_at',
    @Args('order', {
      type: () => String,
      nullable: true,
      defaultValue: Order.DESC,
    })
    order?: Order,
  ): Promise<ReviewResponse> {
    const req = new QueryReviewDto({
      rating,
      offset,
      limit,
      sortBy,
      order,
    });
    const data = await this.bookService.findReviewByBookId(book.id, req);
    const { total, average, details } =
      await this.bookService.summaryReviewByBookId(book.id);
    return { total, average, details, data };
  }

  @ResolveField(() => ID, { name: 'id' })
  resolveId(@Parent() book: Book): string {
    return book.id;
  }

  @ResolveField(() => Float, { name: 'sale_price', nullable: true })
  async salePrice(@Parent() book: Book): Promise<number> {
    return await this.bookService.getCurrentSale(book, 'price');
  }

  @ResolveField(() => Float, { name: 'sale_inventory', nullable: true })
  async saleTotal(@Parent() book: Book): Promise<number> {
    return await this.bookService.getCurrentSale(book, 'inventory');
  }
}
