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
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookStatus } from './constants/status.enum';
import { QueryBookDto } from './dto/query-book.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/constants/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('book')
@ApiTags('Book')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  private readonly logger = new Logger(BookController.name);

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FilesInterceptor('img', 10, {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      limits: { fileSize: 1024 * 1024 },
    }),
  )
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: any,
  ) {
    try {
      const imagePaths = files.map((file) => file.path);
      if (!createBookDto.img_urls || createBookDto.img_urls.length === 0) {
        createBookDto.img_urls = imagePaths;
      }
      await this.bookService.create(createBookDto);
      res
        .status(HttpStatus.CREATED)
        .send({ message: 'Create book successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send({ message: error.message });
    }
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() req: QueryBookDto, @Res() res: any) {
    const books = await this.bookService.findAll(req, true);
    const statuses = Object.values(BookStatus);
    res.status(HttpStatus.OK).render('book', {
      title: 'Book',
      message: 'Get data successfully',
      books,
      statuses,
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const book = await this.bookService.findOne(id);
      res.status(HttpStatus.OK).send(book);
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
    @Res() res: any,
  ) {
    await this.bookService.update(id, updateBookDto);
    res.status(HttpStatus.OK).send({ message: 'Update book successfully' });
  }

  @Get('total')
  @Roles(Role.ADMIN)
  async getCountTotal(@Res() res: any) {
    const total = await this.bookService.getCountTotal();
    res.status(HttpStatus.OK).send(total);
  }
}
