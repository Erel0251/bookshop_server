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
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';

@Controller('book')
@ApiTags('Book')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private readonly logger = new Logger(BookController.name);

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: any,
  ) {
    try {
      // upload to cloudinary
      const result = await this.cloudinaryService.uploadFile(file);
      createBookDto.img_urls = [result.secure_url, ...createBookDto.img_urls];
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
  @UseInterceptors(FileInterceptor('img'))
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: any,
  ) {
    try {
      // upload to cloudinary
      const result = await this.cloudinaryService.uploadFile(file);
      updateBookDto.img_urls = [result.secure_url, ...updateBookDto.img_urls];
      await this.bookService.update(id, updateBookDto);
      res.status(HttpStatus.OK).send({ message: 'Update book successfully' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Get('total')
  @Roles(Role.ADMIN)
  async getCountTotal(@Res() res: any) {
    const total = await this.bookService.getCountTotal();
    res.status(HttpStatus.OK).send(total);
  }
}
