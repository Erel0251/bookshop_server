import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplement } from './entities/supplement.entity';
import { Repository } from 'typeorm';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { SupplementDetail } from './entities/supplement-detail.entity';
import { BookService } from '../book/book.service';
import { CreateSupplementDetailDto } from './dto/create-supplement-detail.dto';
import { UpdateBookDto } from '../book/dto/update-book.dto';
import { QuerySupplementDto } from './dto/query-supplement.dto';

import { Maybe } from 'purify-ts/Maybe';
import { UpdateSupplementDeatailDto } from './dto/update-supplement-detail.dto';
import { BookStatus } from '../book/constants/status.enum';

@Injectable()
export class SupplementService {
  constructor(
    @InjectRepository(Supplement)
    private supplementRepository: Repository<Supplement>,

    @InjectRepository(SupplementDetail)
    private supplementDetailRepository: Repository<SupplementDetail>,

    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(SupplementService.name);

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

  async findAll(req: QuerySupplementDto): Promise<Supplement[]> {
    const filter = new QuerySupplementDto(req);
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

    // BUG: typeORM made a mistake here, it should be is_deleted is true/false instead of is_deleted IS NULL
    Maybe.fromFalsy(filter.is_deleted).ifJust((is_deleted) =>
      query.andWhere('supplement.is_deleted is :is_deleted', {
        is_deleted,
      }),
    );

    Maybe.fromFalsy(filter.order).ifJust((order) =>
      query.orderBy(`supplement.${filter.orderByName}`, order),
    );
    Maybe.fromFalsy(filter.offset).ifJust((offset) => query.offset(offset));
    Maybe.fromFalsy(filter.limit).ifJust((limit) => query.limit(limit));

    query.leftJoinAndSelect(
      'supplement.supplement_details',
      'supplement_details',
    );

    return (await query.getMany()).filter(
      (supplement) => !supplement.is_deleted,
    );
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
    // check if the book already exists
    const supplementDetail = await this.supplementDetailRepository.findOne({
      where: { books: { id: detail.bookId }, supplements: { id } },
    });
    if (supplementDetail) {
      throw new Error('Book already exists in supplement');
    }

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

  async addBook(id: string, bookUpdate: UpdateBookDto): Promise<void | Error> {
    // check if the book already exists
    const supplementDetail = await this.supplementDetailRepository.findOne({
      where: { books: { id: bookUpdate.id }, supplements: { id } },
    });
    if (supplementDetail) {
      throw new Error('Book already exists in supplement');
    }

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
    if (book.status === BookStatus.OUT_OF_STOCK) {
      book.status = BookStatus.AVAILABLE;
    }
    const detail = this.supplementDetailRepository.create(
      bookUpdate.supplement_detail,
    );
    detail.books = book;
    detail.supplements = supplement;

    supplement.total_quantity += bookUpdate.supplement_detail?.quantity;
    supplement.total_price += bookUpdate.supplement_detail?.price;

    await this.supplementRepository.save(supplement);
    await this.supplementDetailRepository.save(detail);
    await this.bookService.update(book.id, book);
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

  async updateDetail(
    id: string,
    detail: UpdateSupplementDeatailDto,
  ): Promise<void | Error> {
    const supplementDetail = await this.supplementDetailRepository.findOne({
      where: { id: detail.id },
      relations: ['books', 'supplements'],
    });
    if (!supplementDetail) {
      throw new Error('Supplement detail not found');
    }
    supplementDetail.books.inventory +=
      detail.quantity - supplementDetail.quantity;
    supplementDetail.supplements.total_quantity +=
      detail.quantity - supplementDetail.quantity;
    supplementDetail.supplements.total_price +=
      detail.price - supplementDetail.price;
    await this.bookService.update(
      supplementDetail.books.id,
      supplementDetail.books,
    );
    await this.supplementRepository.save(supplementDetail.supplements);

    supplementDetail.price = detail.price;
    supplementDetail.quantity = detail.quantity;
    await this.supplementDetailRepository.save(supplementDetail);
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
    supplement.total_quantity -= supplementDetail.quantity;
    supplement.total_price -= supplementDetail.price;
    await this.bookService.update(bookId, book);
    await this.supplementRepository.save(supplement);
    await this.supplementDetailRepository.remove(supplementDetail);
  }
}
