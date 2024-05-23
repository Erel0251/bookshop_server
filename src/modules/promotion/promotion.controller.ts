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
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { CreatePromotionBookDto } from './dto/create-promotion-book.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('promotion')
@ApiTags('Promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  private readonly logger = new Logger(PromotionController.name);

  // Create a new promotion event
  @Post()
  async create(
    @Body() createPromotionDto: CreatePromotionDto,
    @Res() res: any,
  ) {
    try {
      this.promotionService.create(createPromotionDto);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Get all promotion events
  @Get()
  async findAll(@Res() res: any) {
    try {
      const promotions = this.promotionService.findAll();
      res.status(HttpStatus.OK).render('promotion', { promotions });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Get specific promotion event
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const promotion = this.promotionService.findOne(id);
      res.status(HttpStatus.OK).send(promotion);
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
      res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Delete specific promotion event
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: any) {
    try {
      this.promotionService.remove(id);
      res.status(HttpStatus.OK).send();
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
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  // Update specific promotion book
  @Patch(':id/book')
  async updatePromotionBook(
    @Param('id') id: string,
    @Body() promotionBook: any,
    @Res() res: any,
  ) {
    try {
      this.promotionService.updatePromotionBook(id, promotionBook);
      res.status(HttpStatus.OK).send();
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
      res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }
}
