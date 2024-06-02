import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { PromotionBook } from './entities/promotion-book.entity';
import { Book } from '../book/entities/book.entity';
import { CreatePromotionBookDto } from './dto/create-promotion-book.dto';
import { UpdatePromotionBookDto } from './dto/update-promotion-book.dto';
import { PromotionType } from './constants/promotion-type.enum';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotion: Repository<Promotion>,

    @InjectRepository(PromotionBook)
    private promotionBook: Repository<PromotionBook>,
  ) {}

  async create(
    createPromotionDto: CreatePromotionDto,
  ): Promise<Promotion | Error> {
    return await this.promotion.save(createPromotionDto);
  }

  async findAll(): Promise<Promotion[]> {
    return await this.promotion.find({
      where: { is_deleted: false },
      relations: ['promotion_books', 'promotion_books.book'],
    });
  }

  async findOne(id: string): Promise<Promotion> {
    return await this.promotion.findOne({
      where: { id },
      relations: ['promotion_books', 'promotion_books.book'],
    });
  }

  async findType(type?: PromotionType): Promise<Promotion[]> {
    const date = new Date();
    return await this.promotion.find({
      where: {
        type,
        is_deleted: false,
        from: LessThanOrEqual(date),
        to: MoreThanOrEqual(date),
      },
      relations: ['promotion_books', 'promotion_books.book'],
    });
  }

  async findDetailPromotion(id: string): Promise<PromotionBook[]> {
    const promotion = await this.promotion.findOne({
      where: { id },
      relations: ['promotion_books', 'promotion_books.book'],
    });
    return promotion.promotion_books;
  }

  async findBookByPromotionBookId(id: string): Promise<Book> {
    const promotionBook = await this.promotionBook.findOne({
      where: { id },
      relations: ['book'],
    });
    return promotionBook.book;
  }

  async update(id: string, update: UpdatePromotionDto): Promise<void | Error> {
    await this.promotion.update(id, update);
  }

  async delete(id: string): Promise<void | Error> {
    const promotion = await this.promotion.findOne({
      where: { id },
      relations: ['promotion_books'],
    });
    if (!promotion) {
      throw new Error('Promotion not found');
    }
    for (const book of promotion.promotion_books)
      await this.promotionBook.delete(book.id);
    await this.promotion.delete(id);
  }

  async createPromotionBook(
    id: string,
    bookId: string,
    detailPromotion: CreatePromotionBookDto,
  ): Promise<void | Error> {
    // check if the promotion book already exists
    const promotionBook = await this.promotionBook.findOne({
      where: { promotion: { id }, book: { id: bookId } },
    });
    if (promotionBook) {
      throw new Error('Promotion book already exists');
    }

    const promotion = await this.promotion.findOne({ where: { id } });
    if (!promotion) {
      throw new Error('Promotion not found');
    }
    const book = await Book.findOne({ where: { id: bookId } });
    detailPromotion.price = book.price * (1 - detailPromotion.discount / 100);
    // if the quantity is greater than the inventory, set the quantity to the inventory
    // if the quantity is zero or undefined, set the quantity to inventory
    detailPromotion.quantity = !detailPromotion.quantity
      ? book.inventory
      : Math.min(detailPromotion.quantity, book.inventory);

    const detail = await this.promotionBook.create(detailPromotion);
    detail.promotion = promotion;
    detail.book = book;
    await this.promotionBook.save(detail);
  }

  async updatePromotionBook(
    id: string,
    promotionBook: UpdatePromotionBookDto,
  ): Promise<void | Error> {
    const promotionBookEntity = await this.promotionBook.findOne({
      where: { id },
    });
    if (!promotionBookEntity) {
      throw new Error('Promotion book not found');
    }
    const book = await Book.findOne({ where: { id: promotionBook.id } });
    promotionBookEntity.price = book.price * (1 - promotionBook.discount / 100);
    promotionBookEntity.quantity = !promotionBook.quantity
      ? book.inventory
      : Math.min(promotionBook.quantity, book.inventory);
    await this.promotionBook.update(id, promotionBook);
  }

  async findDetailPromotionByBook(book: Book): Promise<PromotionBook> {
    // get the detail promotion where current date between from and to
    const date = new Date();
    const promotions = await this.promotion
      .createQueryBuilder('promotion')
      .where('promotion.from <= :date', { date })
      .andWhere('promotion.to >= :date', { date })
      .leftJoinAndSelect('promotion.promotion_books', 'promotion_books')
      .leftJoinAndSelect('promotion_books.book', 'book')
      .andWhere('book.id = :bookId', { bookId: book.id })
      .getMany();

    // if no promotion, return the original price
    if (promotions.length === 0) {
      return null;
    }

    // get min price of all promotions
    let minPrice = book.price;
    let detailPromotion: PromotionBook;
    for (const promotion of promotions) {
      for (const promotionBook of promotion.promotion_books) {
        minPrice = Math.min(minPrice, promotionBook.price);
        if (minPrice === promotionBook.price) {
          detailPromotion = promotionBook;
        }
      }
    }

    return detailPromotion;
  }

  async deletePromotionBook(
    promotionId: string,
    bookId: string,
  ): Promise<void | Error> {
    const promotionBook = await this.promotionBook.findOne({
      where: { promotion: { id: promotionId }, book: { id: bookId } },
    });
    if (!promotionBook) {
      throw new Error('Promotion book not found');
    }
    await this.promotionBook.delete(promotionBook.id);
  }
}
