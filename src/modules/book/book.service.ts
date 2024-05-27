import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { Book } from './entities/book.entity';
import { AuthorService } from '../author/author.service';
import { Author } from '../author/entities/author.entity';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { BookStatus } from './constants/status.enum';
import { generateISBN } from './helpers/helper';
import { SupplementDetail } from '../supplement/entities/supplement-detail.entity';
import { ReviewService } from '../review/review.service';
import { Review } from '../review/entities/review.entity';
import { PromotionService } from '../promotion/promotion.service';
import { Promotion } from '../promotion/entities/promotion.entity';
import { QueryBookDto } from './dto/query-book.dto';
import { Maybe } from 'purify-ts/Maybe';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private book: Repository<Book>,

    private readonly authorService: AuthorService,
    private readonly reviewService: ReviewService,
    private readonly promotionService: PromotionService,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  private readonly logger = new Logger(BookService.name);

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // generate isbn if needed
    createBookDto.isbn = createBookDto.isbn || generateISBN();
    // lower case name
    createBookDto.title = createBookDto.title.toLowerCase();
    return await this.book.save(createBookDto);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<void> {
    updateBookDto.title =
      updateBookDto.title ?? updateBookDto.title.toLowerCase();
    await this.book.update(id, updateBookDto);
  }

  async findAll(req?: QueryBookDto): Promise<Book[]> {
    const filter = new QueryBookDto(req);
    const query = this.book.createQueryBuilder('book');

    Maybe.fromFalsy(filter.title).ifJust((title) =>
      query.andWhere('book.title LIKE :title', {
        title: `%${title}%`,
      }),
    );

    Maybe.fromFalsy(filter.isbn).ifJust((isbn) =>
      query.andWhere('book.isbn LIKE :isbn', {
        isbn: `%${isbn}%`,
      }),
    );

    Maybe.fromFalsy(filter.publisher).ifJust((publisher) =>
      query.andWhere('book.publisher LIKE :publisher', {
        publisher: `%${publisher}%`,
      }),
    );

    Maybe.fromFalsy(filter.status).ifJust((status) =>
      query.andWhere('book.status LIKE :status', {
        status: `%${status}%`,
      }),
    );

    Maybe.fromFalsy(filter.offset).ifJust((offset) => query.offset(offset));

    Maybe.fromFalsy(filter.limit).ifJust((limit) => query.limit(limit));

    return await query.getMany();
  }

  async findOne(id: string): Promise<Book> {
    return await this.book.findOne({
      where: { id },
    });
  }

  async findBooksByAuthorId(id: string): Promise<Book[]> {
    try {
      const author = await this.authorService.findOne(id);
      return await this.book.find({ where: { authors: author as Author } });
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }

  async findAuthorByBookId(id: string): Promise<Author[]> {
    return await this.authorService.findAuthorByBookId(id);
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

  async findPromotionInfoByBookId(id: string): Promise<Promotion> {
    const book = await this.book.findOne({ where: { id } });
    return await this.promotionService.findPromotionByBook(book);
  }

  async getCountTotal(): Promise<number> {
    return await this.book.count();
  }

  async updateInventory(id: string, buy: number = 0): Promise<void> {
    const book = await this.book.findOne({ where: { id } });
    book.inventory -= buy;
    // if inventory empty, set status to 'out of stock'
    if (book.inventory === 0) {
      book.status = BookStatus.OUT_OF_STOCK;
    }
    await this.book.save(book);
  }

  async updateSupplement(
    id: string,
    supplementDetail: SupplementDetail,
  ): Promise<void> {
    const book = await this.book.findOne({ where: { id } });
    book.inventory += supplementDetail.quantity;
    book.supplement_details.push(supplementDetail);
    await this.book.save(book);
  }

  async delete(id: string): Promise<void | Error> {
    const book = await this.book.findOne({ where: { id } });
    book.is_deleted = true;
    await this.book.save(book);
  }
}
