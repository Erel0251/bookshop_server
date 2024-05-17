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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  private readonly looger = new Logger(BookController.name);

  // TODO: Remove or comment, book only created when supplement is created or updated
  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Res() res: any) {
    try {
      await this.bookService.create(createBookDto);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.looger.error(error);
      res.status(error.status).send();
    }
  }

  @Get()
  findAll(@Res() res: any) {
    const books = this.bookService.findAll();
    res.status(HttpStatus.OK).send(books);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const book = this.bookService.findOne(id);
      res.status(HttpStatus.OK).send(book);
    } catch (error) {
      this.looger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Get('total')
  async getCountTotal(@Res() res: any) {
    const total = await this.bookService.getCountTotal();
    res.status(HttpStatus.OK).send(total);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    console.log(updateBookDto);
    console.log(id);
  }
}
