import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Res,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { CreatePromotionBookDto } from './dto/create-promotion-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { BookService } from '../book/book.service';
import { UpdatePromotionBookDto } from './dto/update-promotion-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('promotion')
@ApiTags('Promotion')
@UseGuards(JwtAuthGuard)
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(PromotionController.name);

  // Create a new promotion event
  @Post()
  async create(
    @Body() createPromotionDto: CreatePromotionDto,
    @Res() res: any,
  ) {
    try {
      this.promotionService.create(createPromotionDto);
      res
        .status(HttpStatus.CREATED)
        .send({ message: 'Create promotion successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Get all promotion events
  @Get()
  async findAll(@Res() res: any) {
    try {
      const promotions = await this.promotionService.findAll();
      res
        .status(HttpStatus.OK)
        .render('promotion', { promotions, title: 'Promotion' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Get specific promotion event
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const promotion = await this.promotionService.findOne(id);
      const books = await this.bookService.findAll();
      res.status(HttpStatus.OK).render('detailPromotion', {
        title: 'Promotion Detail',
        promotion,
        books,
      });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Update specific promotion event
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @Res() res: any,
  ) {
    try {
      this.promotionService.update(id, updatePromotionDto);
      res
        .status(HttpStatus.OK)
        .send({ message: 'Update promotion successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Delete specific promotion event
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: any) {
    try {
      await this.promotionService.delete(id);
      res
        .status(HttpStatus.OK)
        .send({ message: 'Delete promotion successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Add a book to a promotion event
  @Post(':id/book/:bookId')
  async createPromotionBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Body() createPromotionBookDto: CreatePromotionBookDto,
    @Res() res: any,
  ) {
    try {
      this.promotionService.createPromotionBook(
        id,
        bookId,
        createPromotionBookDto,
      );
      res
        .status(HttpStatus.CREATED)
        .send({ message: 'Add book to promotion successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Update specific promotion book
  @Patch(':id/book/:bookId')
  async updatePromotionBook(
    @Param('id') id: string,
    @Param('bookId') bookId: string,
    @Body() promotionBook: UpdatePromotionBookDto,
    @Res() res: any,
  ) {
    try {
      promotionBook.id = bookId;
      this.promotionService.updatePromotionBook(id, promotionBook);
      res
        .status(HttpStatus.OK)
        .send({ message: 'Update promotion book successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Delete specific promotion book
  @Delete(':id/book/:bookId')
  async deletePromotionBook(
    @Param('id') id: string,
    @Param('bookId') bookId: string,
    @Res() res: any,
  ) {
    try {
      this.promotionService.deletePromotionBook(id, bookId);
      res
        .status(HttpStatus.OK)
        .send({ message: 'Delete promotion book successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }
}
