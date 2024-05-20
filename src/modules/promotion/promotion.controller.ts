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
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { CreatePromotionBookDto } from './dto/create-promotion-book.dto';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  private readonly logger = new Logger(PromotionController.name);

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

  @Post(':id/book')
  async createPromotionBook(
    @Body() createPromotionBookDto: CreatePromotionBookDto,
    @Res() res: any,
  ) {
    try {
      this.promotionService.createPromotionBook(createPromotionBookDto);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: any) {
    try {
      const promotion = this.promotionService.findOne(id);
      res.status(HttpStatus.OK).send(promotion);
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

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
