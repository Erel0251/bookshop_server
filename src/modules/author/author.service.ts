import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private author: Repository<Author>,

    @InjectRepository(Book)
    private book: Repository<Book>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    return 'This action adds a new author';
  }

  findAll() {
    return `This action returns all author`;
  }

  async findOne(id: string): Promise<Author> {
    return await this.author.findOne({ where: { id } });
  }

  async findAuthorByBook(book: Book): Promise<Author[]> {
    return await this.author.find({ where: { books: book } });
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
