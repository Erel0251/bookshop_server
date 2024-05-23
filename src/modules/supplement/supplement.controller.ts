import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Res,
  HttpStatus,
  Get,
  Delete,
  ParseUUIDPipe,
  Logger,
  Query,
} from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateBookDto } from '../book/dto/create-book.dto';
import { UpdateBookDto } from '../book/dto/update-book.dto';
import { QuerySupplementDto } from './dto/query-supplement.dto';
import { BookService } from '../book/book.service';

@ApiTags('Supplement')
@Controller('supplement')
export class SupplementController {
  constructor(
    private readonly supplementService: SupplementService,
    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(SupplementController.name);

  // Create a new supplement
  @Post()
  async asynccreate(
    @Body() createSupplementDto: CreateSupplementDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.create(createSupplementDto);
      return res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get all supplements
  @Get()
  async findAll(@Res() res: any) {
    try {
      const supplements = await this.supplementService.findAll();
      res.status(HttpStatus.OK);
      res.render('supplement', {
        message: 'Get data successfully',
        supplements,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Import supplements from CSV or Excel file
  @Post('import')
  async import(@Res() res: any) {
    try {
      //await this.supplementService.import();
      return res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Filter Query supplement by name, supplier, date, month, year
  @Get('filter')
  async filter(@Query() filter: QuerySupplementDto, @Res() res: any) {
    try {
      const supplements = await this.supplementService.filter(filter);
      return res.status(HttpStatus.OK).render('supplement', {
        message: 'Filter data successfully',
        supplements,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get a supplement by id
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const supplement = await this.supplementService.findOne(id);
      const books = await this.bookService.findAll();
      res.status(HttpStatus.OK).render('detailSupplement', {
        message: 'Get data successfully',
        supplement,
        books,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Update a supplement by id
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSupplementDto: UpdateSupplementDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.update(id, updateSupplementDto);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Soft delete a supplement by id
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      await this.supplementService.remove(id);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Create book in supplement
  @Patch(':id/create-book')
  async createBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() book: CreateBookDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.createBookInSupplement(id, book);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Add book to supplement
  @Patch(':id/add-book')
  async addBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() book: UpdateBookDto, // book entities
    @Res() res: any,
  ) {
    try {
      await this.supplementService.addBook(id, book);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Update book in supplement
  @Patch(':id/update-book')
  async updateBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() book: UpdateBookDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.updateBook(id, book);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Remove book from supplement
  @Patch(':id/remove-book')
  async removeBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('bookId', ParseUUIDPipe) bookId: string,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.removeBook(id, bookId);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }
}
