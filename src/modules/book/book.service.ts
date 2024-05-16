import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

// import { CreateBookDto } from './dto/create-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';

import { Book } from './entities/book.entity';
import { AuthorService } from '../author/author.service';
import { Author } from '../author/entities/author.entity';
import { RatingService } from '../rating/rating.service';
import { Rating } from '../rating/entities/rating.entity';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { SaleService } from '../sale/sale.service';
import { Sale } from '../sale/entities/sale.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private book: Repository<Book>,

    private readonly authorService: AuthorService,
    private readonly ratingService: RatingService,
    private readonly categoryService: CategoryService,
    private readonly saleService: SaleService,
  ) {}

  create() {
    return 'This action adds a new book';
  }

  async findAll(offset: number = 0, limit: number = 20): Promise<Book[]> {
    return await this.book.find({ skip: offset, take: limit });
  }

  async findOne(id: string): Promise<Book> {
    return await this.book.findOne({ where: { id } });
  }

  async findBooksByAuthorId(id: string): Promise<Book[]> {
    const author = await this.authorService.findOne(id);
    return await this.book.find({ where: { authors: author } });
  }

  async findAuthorByBookId(id: string): Promise<Author[]> {
    const book = await this.book.findOne({ where: { id } });
    return await this.authorService.findAuthorByBook(book);
  }

  async findRatingByBookId(id: string): Promise<Rating[]> {
    const book = await this.book.findOne({ where: { id } });
    return await this.ratingService.findRatingByBook(book);
  }

  async findCategoryByBookId(id: string): Promise<Category[]> {
    const book = await this.book.findOne({ where: { id } });
    return await this.categoryService.findCategoryByBook(book);
  }

  async findSaleInfoByBookId(id: string): Promise<Sale> {
    const book = await this.book.findOne({ where: { id } });
    return await this.saleService.findSaleByBook(book);
  }

  update(id: number) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }

  async getCountTotal(): Promise<number> {
    return await this.book.count();
  }
}
