import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { Book } from './entities/book.entity';
//import { AuthorService } from '../author/author.service';
//import { Author } from '../author/entities/author.entity';
import { Category } from '../category/entities/category.entity';
import { BookStatus } from './constants/status.enum';
import { generateISBN } from './helpers/helper';
import { SupplementDetail } from '../supplement/entities/supplement-detail.entity';
import { ReviewService } from '../review/review.service';
import { Review } from '../review/entities/review.entity';
import { PromotionService } from '../promotion/promotion.service';
import { QueryBookDto } from './dto/query-book.dto';
import { Maybe } from 'purify-ts/Maybe';

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

  async findAll(req?: QueryBookDto): Promise<Book[]> {
    const filter = new QueryBookDto(req);
    const query = this.book.createQueryBuilder('book');

    Maybe.fromFalsy(filter.keyword).ifJust((keyword) =>
      query.andWhere('book.keyword LIKE :keyword', {
        keyword: `%${keyword}%`,
      }),
    );

    Maybe.fromFalsy(filter.status).ifJust((status) =>
      query.andWhere('book.status LIKE :status', {
        status: `%${status}%`,
      }),
    );

    Maybe.fromFalsy(filter.category).ifJust((category) =>
      query
        .leftJoinAndSelect('book.category', 'category')
        .andWhere('category.name LIKE :category', {
          category: `%${category}%`,
        }),
    );

    Maybe.fromFalsy(filter.rating).ifJust((rating) =>
      query.andWhere('book.rating = :rating', { rating }),
    );

    Maybe.fromFalsy(filter.fromPrice).ifJust((fromPrice) =>
      query.andWhere('book.price >= :fromPrice', { fromPrice }),
    );

    Maybe.fromFalsy(filter.toPrice).ifJust((toPrice) =>
      query.andWhere('book.price <= :toPrice', { toPrice }),
    );

    // alway get non-deleted book
    query.andWhere('book.is_deleted = :is_deleted', { is_deleted: false });

    query.orderBy(filter.sortBy || 'book.created_at', filter.order || 'DESC');

    query.offset(filter.offset || 0);

    query.limit(filter.limit || 20);

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

  async getCountTotal(): Promise<number> {
    return await this.book.count({ where: { is_deleted: false } });
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

  async getCurrentSalePrice(book: Book): Promise<number> {
    const promotion =
      await this.promotionService.findDetailPromotionByBook(book);
    return promotion ? promotion.price : undefined;
  }
}
