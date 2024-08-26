import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { CounterService } from './counter.service';
import { BookService } from '../book/book.service';
import { PromotionService } from '../promotion/promotion.service';
import { Book } from '../book/entities/book.entity';

@Controller('counter')
export class CounterController {
  constructor(
    private readonly counterService: CounterService,
    private readonly bookService: BookService,
    private readonly promotionService: PromotionService,
  ) {}

  @Get()
  async getCounter(@Res() res: any) {
    res.status(HttpStatus.OK).render('counter', {
      title: 'Counter',
    });
  }

  @Get('isbn/:isbn')
  async findOneByIsbn(@Param('isbn') isbn: string, @Res() res: any) {
    try {
      const book = await this.bookService.findOneByIsbn(isbn);
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      const bonus = await this.promotionService.findDetailPromotionByBook(
        book as Book,
      );
      res.status(HttpStatus.OK).send({
        book,
        bonus,
      });
    } catch (error) {
      res.status(error.status).send(error.message);
    }
  }
}
