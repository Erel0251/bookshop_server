import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  Get,
  Logger,
  Inject,
  forwardRef,
  Delete,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { BookService } from '../book/book.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,

    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(CategoryController.name);

  // Create a new category
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: any) {
    try {
      const category = await this.categoryService.create(createCategoryDto);
      return res.status(HttpStatus.CREATED).send(category);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get all categories
  @Get()
  async findAll(@Res() res: any) {
    try {
      const categories = await this.categoryService.findAll();
      return res.status(HttpStatus.OK).send(categories);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get a category by ID
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const category = await this.categoryService.findOne(id);
      return res.status(HttpStatus.OK).send(category);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Update a category
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: any,
  ) {
    try {
      return this.categoryService.update(id, updateCategoryDto);
    } catch (error) {
      if (error.message === 'children exist') {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Delete a category
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      await this.categoryService.remove(id);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get books by category
  @Get(':id/book')
  async findBooksByCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: any,
  ) {
    try {
      const books = await this.bookService.findBookByCategory(id);
      return res.status(HttpStatus.OK).send(books);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Add a book to a category
  @Post(':id/book/:bookId')
  async addBookToCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Res() res: any,
  ) {
    try {
      await this.bookService.addBookCategory(id, bookId);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Remove a book from a category
  @Delete(':id/book/:bookId')
  async removeBookFromCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Res() res: any,
  ) {
    try {
      await this.bookService.removeBookCategory(id, bookId);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }
}
