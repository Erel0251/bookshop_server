import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { Repository } from 'typeorm';
import { PromotionBook } from './entities/promotion-book.entity';
import { Book } from '../book/entities/book.entity';
import { CreatePromotionBookDto } from './dto/create-promotion-book.dto';

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
    return await this.promotion.find();
  }

  async findOne(id: string): Promise<Promotion | Error> {
    return await this.promotion.findOne({ where: { id } });
  }

  async update(id: string, update: UpdatePromotionDto): Promise<void | Error> {
    await this.promotion.update(id, update);
  }

  async remove(id: string): Promise<void | Error> {
    const promotion = await this.promotion.findOne({ where: { id } });
    if (!promotion) {
      throw new Error('Promotion not found');
    }
    promotion.is_deleted = true;
    await this.promotion.save(promotion);
  }

  async createPromotionBook(
    promotionBook: CreatePromotionBookDto,
  ): Promise<PromotionBook | Error> {
    return await this.promotionBook.save(promotionBook);
  }

  async updatePromotionBook(
    promotionId: string,
    promotionBook: PromotionBook,
  ): Promise<void | Error> {
    await this.promotionBook.update(promotionId, promotionBook);
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

  async findPromotionByBook(book: Book): Promise<Promotion> {
    const promotionBook = await this.promotionBook.findOne({
      where: { book },
      relations: ['promotion'],
    });
    return promotionBook.promotion;
  }
}
