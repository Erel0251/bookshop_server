import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  HttpStatus,
  Logger,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookStatus } from './constants/status.enum';
import { QueryBookDto } from './dto/query-book.dto';

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  private readonly logger = new Logger(BookController.name);

  // TODO: Remove or comment, book only created when supplement is created or updated
  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Res() res: any) {
    try {
      await this.bookService.create(createBookDto);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send();
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    const books = await this.bookService.findAll();
    const statuses = Object.values(BookStatus);
    res.status(HttpStatus.OK).render('book', {
      message: 'Get data successfully',
      books,
      statuses,
    });
  }

  @Get('filter')
  async filter(@Query() req: QueryBookDto, @Res() res: any) {
    try {
      const books = await this.bookService.filter(req);
      const statuses = Object.values(BookStatus);
      return res.status(HttpStatus.OK).render('book', {
        message: 'Filter data successfully',
        books,
        statuses,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const book = this.bookService.findOne(id);
      res.status(HttpStatus.OK).send(book);
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    await this.bookService.update(id, updateBookDto);
  }

  @Get('total')
  async getCountTotal(@Res() res: any) {
    const total = await this.bookService.getCountTotal();
    res.status(HttpStatus.OK).send(total);
  }
}
