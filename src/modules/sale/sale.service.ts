import { Injectable } from '@nestjs/common';
import { Book } from '../book/entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleBook } from './entities/sale-book.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { UpdateSaleBookDto } from './dto/update-sale-book.dto';
import { CreateSaleBookDto } from './dto/create-sale-book.dto';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private sale: Repository<Sale>,

    @InjectRepository(SaleBook)
    private saleBook: Repository<SaleBook>,
  ) {}

  async create(sale: CreateSaleDto): Promise<Sale | Error> {
    return this.sale.save(sale);
  }

  async findOne(id: string): Promise<Sale> {
    return this.sale.findOne({ where: { id } });
  }

  async findAll(): Promise<Sale[]> {
    return this.sale.find();
  }

  async update(id: string, sale: UpdateSaleDto): Promise<void | Error> {
    await this.sale.update(id, sale);
  }

  async createSaleBook(
    saleId: string,
    saleBook: CreateSaleBookDto,
  ): Promise<SaleBook | Error> {
    return this.saleBook.save({ sale: { id: saleId }, saleBook });
  }

  async updateSaleBook(
    saleId: string,
    saleBook: UpdateSaleBookDto,
  ): Promise<void | Error> {
    await this.saleBook.update({ sale: { id: saleId } }, saleBook);
  }

  async removeSaleBook(
    saleId: string,
    book: UpdateSaleBookDto,
  ): Promise<void | Error> {
    await this.saleBook.delete({ sale: { id: saleId }, book });
  }

  async findSaleByBook(book: Book): Promise<Sale> {
    const saleBook = await this.saleBook.findOne({
      where: { book },
      relations: ['sale'],
    });
    return saleBook.sale;
  }
}
