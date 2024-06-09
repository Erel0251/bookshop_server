import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { Book } from './entities/book.entity';
//import { AuthorService } from '../author/author.service';
//import { Author } from '../author/entities/author.entity';
import { Category } from '../category/entities/category.entity';
import { generateISBN, queryBuilder } from './helpers/helper';
import { SupplementDetail } from '../supplement/entities/supplement-detail.entity';
import { ReviewService } from '../review/review.service';
import { Review } from '../review/entities/review.entity';
import { PromotionService } from '../promotion/promotion.service';
import { QueryBookDto } from './dto/query-book.dto';
import { QueryReviewDto } from '../review/dto/query-review.dto';
import { BookStatus } from './constants/status.enum';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private book: Repository<Book>,

    //private readonly authorService: AuthorService,
    private readonly reviewService: ReviewService,
    private readonly promotionService: PromotionService,
  ) {}

  private readonly logger = new Logger(BookService.name);

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // generate isbn if needed
    createBookDto.isbn = createBookDto.isbn || generateISBN();
    // lower case name
    createBookDto.title = createBookDto.title.toLowerCase();
    createBookDto.author = createBookDto.author.toLowerCase();
    createBookDto.publisher = createBookDto.publisher.toLowerCase();
    //const author = await this.authorService.saveOne(createBookDto.author);
    createBookDto.keyword = `${createBookDto.title}-${createBookDto.author}-${createBookDto.publisher}-${createBookDto.isbn}`;
    return await this.book.save(createBookDto);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<void> {
    updateBookDto.title =
      updateBookDto.title ?? updateBookDto.title.toLowerCase();
    updateBookDto.author =
      updateBookDto.author ?? updateBookDto.author.toLowerCase();
    await this.book.update(id, updateBookDto);
  }

  async findAll(req?: QueryBookDto, isAdmin: boolean = false): Promise<Book[]> {
    const filter = new QueryBookDto(req);
    const query = queryBuilder(this.book.createQueryBuilder('book'), filter);

    // if not admin, need pagination
    if (!isAdmin) {
      // if not admin, get books with proper status
      query.andWhere('book.status != :status', {
        status: BookStatus.DISCONTINUED,
      });
      query.offset(req.offset || 0);
      query.limit(req.limit || 20);
    } else {
      // if admin, get all reviews and users
      query.leftJoinAndSelect('book.reviews', 'review');
      query.leftJoinAndSelect('review.user', 'user');
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Book> {
    return await this.book.findOne({
      where: { id },
    });
  }

  async findReviewByBook(id: string): Promise<Review[]> {
    const book = await this.book.findOne({ where: { id } });
    return await this.reviewService.findReviewByBook(book);
  }

  async findCategoryByBookId(id: string): Promise<Category> {
    const book = await this.book.findOne({
      where: { id },
      relations: ['category'],
    });
    return book.category;
  }

  // CLIENT USE CASE
  async getCountTotal(req?: QueryBookDto): Promise<number> {
    const filter = new QueryBookDto(req);
    const query = queryBuilder(this.book.createQueryBuilder('book'), filter);
    return (await query.getMany()).length;
  }

  async updateSupplement(
    id: string,
    supplementDetail: SupplementDetail,
  ): Promise<void> {
    const book = await this.book.findOne({ where: { id } });
    book.inventory = Number(book.inventory) + Number(supplementDetail.quantity);
    book.supplement_details.push(supplementDetail);
    await this.book.save(book);
  }

  async delete(id: string): Promise<void | Error> {
    const book = await this.book.findOne({ where: { id } });
    book.is_deleted = true;
    await this.book.save(book);
  }

  async getCurrentSalePrice(book: Book): Promise<number> {
    const promotion =
      await this.promotionService.findDetailPromotionByBook(book);
    return promotion ? promotion.price : undefined;
  }

  async getPublisher(): Promise<string[]> {
    const publisher = await this.book
      .createQueryBuilder('book')
      .select('DISTINCT book.publisher')
      .getRawMany();
    return publisher.map((p) => p.publisher);
  }

  async findPopular(): Promise<Book[]> {
    // return best seller books current month
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return await this.book
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.order_details', 'order_detail')
      .groupBy('book.id')
      .orderBy('COALESCE(SUM(order_detail.quantity), 0)', 'DESC')
      .where('order_detail.created_at BETWEEN :firstDay AND :lastDay', {
        firstDay,
        lastDay,
      })
      .select(['book', 'SUM(order_detail.quantity) as total'])
      .getMany();
  }

  async findReviewByBookId(id: string, req: QueryReviewDto): Promise<Review[]> {
    const query = this.book
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.reviews', 'reviews')
      .where('book.id = :id', { id });
    if (req.rating) {
      query.andWhere('reviews.rating = :rating', { rating: req.rating });
    }
    query.orderBy(`reviews.${req.sortBy}`, req.order);
    query.offset(req.offset || 0);
    query.limit(req.limit || 10);
    const book = await query.getOne();
    return book.reviews;
  }

  async summaryReviewByBookId(id: string): Promise<any> {
    const book = await this.book
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.reviews', 'reviews')
      .where('book.id = :id', { id })
      .getOne();
    const reviews = book.reviews;
    const total = reviews.length;
    if (total === 0) {
      return { total, average: '0.00', details: [0, 0, 0, 0, 0] };
    }
    const average = (
      reviews.reduce((acc, cur) => acc + cur.rating, 0) / total
    ).toFixed(2);
    const details = [0, 0, 0, 0, 0].map(
      (_, i) => reviews.filter((r) => r.rating === i + 1).length,
    );
    return { total, average, details };
  }
}
