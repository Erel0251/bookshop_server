import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from '../book/entities/book.entity';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private category: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<void | Error> {
    const category = this.category.create(createCategoryDto);
    if (createCategoryDto.father_id) {
      const father = await this.category.findOne({
        where: { id: createCategoryDto.father_id },
      });
      category.father = father;
    }
    await this.category.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.category.find({
      relations: ['books', 'father'],
    });
  }

  async findOne(id: string): Promise<Category | Error> {
    return await this.category.findOne({
      where: { id },
      relations: ['children', 'books'],
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void | Error> {
    if (updateCategoryDto.father_id) {
      const father = await this.category.findOne({
        where: { id: updateCategoryDto.father_id },
      });
      updateCategoryDto.father = father;
    }
    updateCategoryDto.father_id = undefined;
    await this.category.update(id, updateCategoryDto);
  }

  async remove(id: string): Promise<void | Error> {
    const category = await this.category.findOne({ where: { id } });
    // if children exist, reject with reason
    if (category.children) {
      return new Error('children exist');
    }
    await this.category.remove(category);
  }

  async findChildrenCategory(id: string): Promise<Category[]> {
    const children = await this.category.findOne({
      where: { id },
      relations: ['children'],
    });
    return children.children;
  }

  async findFatherCategory(id: string): Promise<Category> {
    const category = await this.category.findOne({
      where: { id },
      relations: ['father'],
    });
    return category.father;
  }

  async findBooksByCategory(id: string): Promise<Book[]> {
    const category = await this.category.findOne({
      where: { id },
      relations: ['books'],
    });
    return category.books;
  }

  async addBookToCategory(id: string, book: Book): Promise<void> {
    const category = await this.category.findOne({
      where: { id },
      relations: ['books'],
    });
    category.books.push(book);
    await this.category.save(category);
  }

  async removeBookFromCategory(id: string, book: Book): Promise<void> {
    const category = await this.category.findOne({
      where: { id },
      relations: ['books'],
    });
    category.books = category.books.filter((b) => b.id !== book.id);
    await this.category.save(category);
  }
}
