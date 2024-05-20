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
} from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Supplement')
@Controller('supplement')
export class SupplementController {
  constructor(private readonly supplementService: SupplementService) {}

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

  // Get all supplements
  @Get()
  async findAll(@Res() res: any) {
    try {
      const supplements = await this.supplementService.findAll();
      return res.status(HttpStatus.OK).send(supplements);
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
      return res.status(HttpStatus.OK).send(supplement);
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

  // Add book to supplement
  @Patch(':id/add-book')
  async addBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('bookId', ParseUUIDPipe) bookId: string, // book entities
    @Res() res: any,
  ) {
    try {
      //await this.supplementService.addBook(id, bookId);
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
    @Body('bookId', ParseUUIDPipe) bookId: string,
    @Res() res: any,
  ) {
    try {
      //await this.supplementService.updateBook(id, bookId);
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
      //await this.supplementService.removeBook(id, bookId);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }
}
