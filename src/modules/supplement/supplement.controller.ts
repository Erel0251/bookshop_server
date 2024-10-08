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
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBookDto } from '../book/dto/update-book.dto';
import { QuerySupplementDto } from './dto/query-supplement.dto';
import { BookService } from '../book/book.service';
import { UpdateSupplementDeatailDto } from './dto/update-supplement-detail.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/constants/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@ApiTags('Supplement')
@Controller('supplement')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplementController {
  constructor(
    private readonly supplementService: SupplementService,
    private readonly bookService: BookService,
  ) {}

  private readonly logger = new Logger(SupplementController.name);

  // Create a new supplement
  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createSupplementDto: CreateSupplementDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.create(createSupplementDto);
      return res
        .status(HttpStatus.CREATED)
        .send({ message: 'Create supplement successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get all supplements
  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: QuerySupplementDto, @Res() res: any) {
    try {
      const supplements = await this.supplementService.findAll(query);
      res.status(HttpStatus.OK).render('supplement', {
        title: 'Supplement',
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '-' +
            Date.now();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return cb(new Error('Only .csv files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Roles(Role.ADMIN)
  async import(@UploadedFile() file: Express.Multer.File, @Res() res: any) {
    try {
      await this.supplementService.import(file.path);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Import supplement successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Get a supplement by id
  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const supplement = await this.supplementService.findOne(id);
      const books = await this.bookService.findAll(undefined, true);
      res.status(HttpStatus.OK).render('detailSupplement', {
        title: 'Supplement Detail',
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
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSupplementDto: UpdateSupplementDto,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.update(id, updateSupplementDto);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Update supplement successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Soft delete a supplement by id
  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      await this.supplementService.remove(id);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Delete supplement successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Add book to supplement
  @Patch(':id/book')
  @Roles(Role.ADMIN)
  async addBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() book: UpdateBookDto, // book entities
    @Res() res: any,
  ) {
    try {
      await this.supplementService.addBook(id, book);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Add book to supplement successfully' });
    } catch (error) {
      this.logger.error(error);
      if (error.message === 'Book already exists in supplement') {
        return res.status(HttpStatus.CONFLICT).send(error.message);
      } else if (error.message === 'Book not found') {
        return res.status(HttpStatus.NOT_FOUND).send(error.message);
      } else if (error.message === 'Supplement not found') {
        return res.status(HttpStatus.NOT_FOUND).send(error.message);
      } else {
        return res.status(error.status).send(error.message);
      }
    }
  }

  // Update detail in supplement
  @Patch(':id/book/:detailId')
  @Roles(Role.ADMIN)
  async updateBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('detailId', ParseUUIDPipe) detailId: string,
    @Body() detail: UpdateSupplementDeatailDto,
    @Res() res: any,
  ) {
    try {
      detail.id = detailId;
      await this.supplementService.updateDetail(id, detail);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Update detail supplement successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }

  // Remove book from supplement
  @Delete(':id/book/:bookId')
  @Roles(Role.ADMIN)
  async removeBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Res() res: any,
  ) {
    try {
      await this.supplementService.removeBook(id, bookId);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Remove book from supplement successfully' });
    } catch (error) {
      this.logger.error(error);
      return res.status(error.status).send(error.message);
    }
  }
}
