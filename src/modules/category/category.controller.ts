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
}
