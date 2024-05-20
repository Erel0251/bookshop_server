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
      relations: ['supplement_details'],
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
    book.inventory += book.supplement_details[0]?.quantity;
    await this.bookService.create(book);
    this.supplementDetailRepository.create(book.supplement_details);
    await this.supplementRepository.save(supplement);
  }

  async addBook(id: string, book: UpdateBookDto): Promise<void | Error> {
    const supplement = await this.supplementRepository.findOne({
      where: { id },
    });
    if (!supplement) {
      throw new Error('Supplement not found');
    }
    if (!book.id) {
      throw new Error('Book id is required');
    }
    book.inventory += book.supplement_details[0]?.quantity;
    await this.bookService.update(book.id, book);
    this.supplementDetailRepository.create(book.supplement_details);
    await this.supplementRepository.save(supplement);
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
    const supplementDetail = await this.supplementDetailRepository.findOne({
      where: { books: { id: book.id }, supplements: { id } },
    });
    // update book inventory
    const quantity =
      book.supplement_details[0]?.quantity - supplementDetail.quantity;
    book.inventory += quantity;
    await this.bookService.update(book.id, book);
    this.supplementDetailRepository.save(book.supplement_details);
    await this.supplementRepository.save(supplement);
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
}
