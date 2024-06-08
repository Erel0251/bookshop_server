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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/constants/role.enum';

@Controller('promotion')
@ApiTags('Promotion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(PromotionController.name);

  // Create a new promotion event
  @Post()
  @Roles(Role.ADMIN)
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
      const books = await this.bookService.findAll(undefined, true);
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
  async createPromotionBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Body() createPromotionBookDto: CreatePromotionBookDto,
    @Res() res: any,
  ) {
    try {
      await this.promotionService.createPromotionBook(
        id,
        bookId,
        createPromotionBookDto,
      );
      res
        .status(HttpStatus.CREATED)
        .send({ message: 'Add book to promotion successfully' });
    } catch (error) {
      this.logger.error(error);
      if (error.message === 'Promotion book already exists') {
        res.status(HttpStatus.CONFLICT).send(error.message);
      } else {
        res.status(error.status).send(error.message);
      }
    }
  }

  // Update specific promotion book
  @Patch(':id/book/:detailId')
  @Roles(Role.ADMIN)
  async updatePromotionBook(
    @Param('id') id: string,
    @Param('detailId') detailId: string,
    @Body() promotionBook: UpdatePromotionBookDto,
    @Res() res: any,
  ) {
    try {
      promotionBook.id = detailId;
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
  @Roles(Role.ADMIN)
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
      if (error.message === 'Promotion book not found') {
        res.status(HttpStatus.NOT_FOUND).send(error.message);
      } else {
        res.status(error.status).send(error.message);
      }
    }
  }
}
