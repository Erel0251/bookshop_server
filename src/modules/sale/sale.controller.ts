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
  Delete,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateSaleBookDto } from './dto/create-sale-book.dto';
import { UpdateSaleBookDto } from './dto/update-sale-book.dto';

@ApiTags('Sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  private readonly logger = new Logger(SaleController.name);

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto, @Res() res: any) {
    try {
      this.saleService.create(createSaleDto);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Post('book/:id')
  async createSaleBook(
    @Body() createSaleBookDto: CreateSaleBookDto,
    @Res() res: any,
  ) {
    try {
      this.saleService.createSaleBook(createSaleBookDto);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: any) {
    try {
      const sale = this.saleService.findOne(id);
      res.status(HttpStatus.OK).send(sale);
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    try {
      const sales = this.saleService.findAll();
      res.status(HttpStatus.OK).send(sales);
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @Res() res: any,
  ) {
    try {
      this.saleService.update(id, updateSaleDto);
      res.status(HttpStatus.ACCEPTED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Patch('book/:id')
  async updateSaleBook(
    @Param('id') id: string,
    @Body() updateSaleBookDto: UpdateSaleBookDto,
    @Res() res: any,
  ) {
    try {
      this.saleService.updateSaleBook(id, updateSaleBookDto);
      res.status(HttpStatus.ACCEPTED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: any) {
    try {
      this.saleService.remove(id);
      res.status(HttpStatus.ACCEPTED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Delete('book/:id')
  async deleteSaleBook(
    @Param('id') id: string,
    @Body() bookId: string,
    @Res() res: any,
  ) {
    try {
      this.saleService.deleteSaleBook(id, bookId);
      res.status(HttpStatus.ACCEPTED).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }
}
