import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { Repository } from 'typeorm';
import { PromotionBook } from './entities/promotion-book.entity';
import { Book } from '../book/entities/book.entity';
import { CreatePromotionBookDto } from './dto/create-promotion-book.dto';
import { UpdatePromotionBookDto } from './dto/update-promotion-book.dto';

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

  async findAll(): Promise<Promotion[] | Error> {
    return await this.promotion.find({
      where: { is_deleted: false },
      relations: ['promotion_books', 'promotion_books.book'],
    });
  }

  async findOne(id: string): Promise<Promotion | Error> {
    return await this.promotion.findOne({
      where: { id },
      relations: ['promotion_books', 'promotion_books.book'],
    });
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

  async findPromotionByBook(book: Book): Promise<Promotion> {
    const promotionBook = await this.promotionBook.findOne({
      where: { book },
      relations: ['promotion'],
    });
    return promotionBook.promotion;
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
