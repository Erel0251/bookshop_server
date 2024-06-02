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
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { BookService } from '../book/book.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../user/constants/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Category')
@Controller('category')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,

    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(CategoryController.name);

  // Create a new category
  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: any) {
    try {
      await this.categoryService.create(createCategoryDto);
      return res
        .status(HttpStatus.CREATED)
        .send({ message: 'Create category successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get all categories
  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Res() res: any) {
    try {
      const categories = await this.categoryService.findAll();
      return res.status(HttpStatus.OK).render('category', {
        title: 'Category',
        message: 'Get data successfully',
        categories,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get a category by ID
  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const category = await this.categoryService.findOne(id);
      const books = await this.bookService.findAll();
      return res.status(HttpStatus.OK).render('detailCategory', {
        title: 'Category Detail',
        message: 'Get data successfully',
        category,
        books,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Update a category
  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: any,
  ) {
    try {
      await this.categoryService.update(id, updateCategoryDto);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Update category successfully' });
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
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      await this.categoryService.remove(id);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Delete category successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get books by category
  @Get(':id/book')
  @Roles(Role.ADMIN)
  async findBooksByCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: any,
  ) {
    try {
      const books = await this.categoryService.findBooksByCategory(id);
      return res.status(HttpStatus.OK).send(books);
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Add a book to a category
  @Post(':id/book/:bookId')
  @Roles(Role.ADMIN)
  async addBookToCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Res() res: any,
  ) {
    try {
      const book = await this.bookService.findOne(bookId);
      await this.categoryService.addBookToCategory(id, book);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Add book to category successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Remove a book from a category
  @Delete(':id/book/:bookId')
  @Roles(Role.ADMIN)
  async removeBookFromCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Res() res: any,
  ) {
    try {
      const book = await this.bookService.findOne(bookId);
      await this.categoryService.removeBookFromCategory(id, book);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Remove book from category successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }
}
