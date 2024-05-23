import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplement } from './entities/supplement.entity';
import { Repository } from 'typeorm';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { SupplementDetail } from './entities/supplement-detail.entity';
import { BookService } from '../book/book.service';
import { CreateSupplementDetailDto } from './dto/create-supplement-detail.dto';
import { CreateBookDto } from '../book/dto/create-book.dto';
import { UpdateBookDto } from '../book/dto/update-book.dto';
import { QuerySupplementDto } from './dto/query-supplement.dto';

import { Maybe } from 'purify-ts/Maybe';

@Injectable()
export class SupplementService {
  constructor(
    @InjectRepository(Supplement)
    private supplementRepository: Repository<Supplement>,

    @InjectRepository(SupplementDetail)
    private supplementDetailRepository: Repository<SupplementDetail>,

    private readonly bookService: BookService,
  ) {}

  async create(
    createSupplementDto: CreateSupplementDto,
  ): Promise<Supplement | Error> {
    const supplement = this.supplementRepository.create(createSupplementDto);
    if (createSupplementDto.supplement_details) {
      createSupplementDto.supplement_details.map((detail) =>
        this.createDetailById(supplement.id, detail),
      );
    }
    return this.supplementRepository.save(supplement);
  }

  async findAll(): Promise<Supplement[]> {
    return await this.supplementRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Supplement | Error> {
    return await this.supplementRepository.findOne({
      where: { id },
      relations: ['supplement_details', 'supplement_details.books'],
    });
  }

  async update(
    id: string,
    updateSupplementDto: UpdateSupplementDto,
  ): Promise<Supplement | Error> {
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    this.supplementRepository.merge(supplement, updateSupplementDto);
    return this.supplementRepository.save(supplement);
  }

  async createDetailById(
    id: string,
    detail: CreateSupplementDetailDto,
  ): Promise<void | Error> {
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    const bookSupplement = await this.supplementDetailRepository.save(detail);
    supplement.supplement_details.push(bookSupplement);
    await this.bookService.updateSupplement(detail.bookId, bookSupplement);
    await this.supplementRepository.save(supplement);
  }

  async remove(id: string): Promise<void | Error> {
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    supplement.is_deleted = true;
    await this.supplementRepository.save(supplement);
  }

  async createBookInSupplement(
    id: string,
    book: CreateBookDto,
  ): Promise<void | Error> {
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    book.inventory += book.supplement_detail?.quantity;
    await this.bookService.create(book);
    this.supplementDetailRepository.create(book.supplement_detail);
    await this.supplementRepository.save(supplement);
  }

  async addBook(id: string, bookUpdate: UpdateBookDto): Promise<void | Error> {
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    const book = await this.bookService.findOne(bookUpdate.id);
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    if (!book) {
      throw new Error('Book not found');
    }
    book.inventory += bookUpdate.supplement_detail?.quantity;
    const detail = this.supplementDetailRepository.create(
      bookUpdate.supplement_detail,
    );
    detail.books = book;
    detail.supplements = supplement;
    await this.supplementDetailRepository.save(detail);
    await this.bookService.update(book.id, book);

    /*
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    const book = await this.bookService.findOne(bookUpdate.id);
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    if (!book.id) {
      throw new Error('Book id is required');
    }
    book.inventory += bookUpdate.supplement_detail?.quantity;
    await this.bookService.update(book.id, book);
    const detail = this.supplementDetailRepository.create(
      bookUpdate.supplement_detail,
    );
    book.supplement_detail = detail;
    supplement.supplement_details.push(detail);
    await this.supplementRepository.save(supplement);
    */
  }

  async updateBook(id: string, book: UpdateBookDto): Promise<void | Error> {
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    if (!book.id) {
      throw new Error('Book id is required');
    }
    /*
    const supplementDetail = await this.supplementDetailRepository.findOne({
      where: { books: { id: book.id }, supplements: { id } },
    });
    // update book inventory
    const quantity =
      book.supplement_details?.quantity - supplementDetail.quantity;
    book.inventory += quantity;
    await this.bookService.update(book.id, book);
    this.supplementDetailRepository.save(book.supplement_details);
    await this.supplementRepository.save(supplement);
    */
  }

  async removeBook(
    supplementId: string,
    bookId: string,
  ): Promise<void | Error> {
    const supplement = await this.supplementRepository.findOne({
      where: { id: supplementId },
    });
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    const supplementDetail = await this.supplementDetailRepository.findOne({
      where: { books: { id: bookId }, supplements: { id: supplementId } },
    });
    if (!supplementDetail) {
      throw new Error('Book not found in supplement');
    }
    // update book inventory
    const book = await this.bookService.findOne(bookId);
    book.inventory -= supplementDetail.quantity;
    await this.bookService.update(bookId, book);
    supplement.supplement_details = supplement.supplement_details.filter(
      (detail) => detail.id !== supplementDetail.id,
    );
    await this.supplementRepository.save(supplement);
    // await this.supplementDetailRepository.remove(supplementDetail);
  }

  async filter(filter: QuerySupplementDto): Promise<Supplement[]> {
    const query = this.supplementRepository.createQueryBuilder('supplement');

    Maybe.fromFalsy(filter.name).ifJust((name) =>
      query.andWhere('supplement.name LIKE :name', {
        name: `%${name}%`,
      }),
    );

    Maybe.fromFalsy(filter.supplier).ifJust((supplier) =>
      query.andWhere('supplement.supplier LIKE :supplier', {
        supplier: `%${supplier}%`,
      }),
    );

    Maybe.fromFalsy(filter.date).ifJust((date) =>
      query.andWhere('supplement.date::text LIKE :date', {
        date: `%${date}%`,
      }),
    );

    Maybe.fromFalsy(filter.month).ifJust((month) =>
      query.andWhere('EXTRACT(MONTH FROM supplement.date) = :month', {
        month: parseInt(month),
      }),
    );

    Maybe.fromFalsy(filter.year).ifJust((year) =>
      query.andWhere('EXTRACT(YEAR FROM supplement.date) = :year', {
        year: parseInt(year),
      }),
    );

    return await query.getMany();

    /*
    return await this.supplementRepository
      .createQueryBuilder('supplement')
      .where('supplement.name LIKE :name', { name: `%${filter.name}%` })
      .where('supplement.supplier LIKE :supplier', {
        supplier: `%${filter.supplier}%`,
      })
      .where('supplement.date::text LIKE :date', { date: `%${filter.date}%` })
      .where('EXTRACT(MONTH FROM supplement.date) = :month', {
        month: parseInt(filter.month),
      })
      .where('EXTRACT(YEAR FROM supplement.date) = :year', {
        year: parseInt(filter.year),
      })
      .getMany();
      */
  }
}
