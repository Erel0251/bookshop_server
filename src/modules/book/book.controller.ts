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

  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Res() res: any) {
    try {
      await this.bookService.create(createBookDto);
      res
        .status(HttpStatus.CREATED)
        .send({ message: 'Create book successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send({ message: error.message });
    }
  }

  @Get()
  async findAll(@Query() req: QueryBookDto, @Res() res: any) {
    const books = await this.bookService.findAll(req, true);
    const statuses = Object.values(BookStatus);
    res.status(HttpStatus.OK).render('book', {
      title: 'Book',
      message: 'Get data successfully',
      books,
      statuses,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const book = await this.bookService.findOne(id);
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
    @Res() res: any,
  ) {
    await this.bookService.update(id, updateBookDto);
    res.status(HttpStatus.OK).send({ message: 'Update book successfully' });
  }

  @Get('total')
  async getCountTotal(@Res() res: any) {
    const total = await this.bookService.getCountTotal();
    res.status(HttpStatus.OK).send(total);
  }
}
