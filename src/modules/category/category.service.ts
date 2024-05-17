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

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category | Error> {
    return await this.category.save(createCategoryDto);
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void | Error> {
    await this.category.update(id, updateCategoryDto);
  }

  async removeCategory(id: string): Promise<void | Error> {
    const category = await this.category.findOne({ where: { id } });
    await this.category.remove(category);
  }

  async findCategoryByBook(book: Book): Promise<Category[]> {
    return await this.category.find({ where: { book } });
  }
}
