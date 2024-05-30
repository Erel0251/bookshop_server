import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
  HttpStatus,
  Patch,
  Logger,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
@ApiTags('Author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  private readonly logger = new Logger(AuthorController.name);

  @Post()
  async create(@Body() author: CreateAuthorDto, @Res() res: any) {
    try {
      const result = await this.authorService.create(author);
      res.status(HttpStatus.CREATED).send(result);
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    try {
      const authors = await this.authorService.findAll();
      res.status(HttpStatus.OK).send(authors);
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      const author = await this.authorService.findOne(id);
      res.status(HttpStatus.OK).send(author);
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Get(':id/books')
  async findAuthorByBookId(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: any,
  ) {
    try {
      //const authors = await this.authorService.findAuthorByBookId(id);
      res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() author: UpdateAuthorDto,
    @Res() res: any,
  ) {
    try {
      await this.authorService.update(id, author);
      res.status(HttpStatus.ACCEPTED).send({ message: 'Author updated' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Res() res: any) {
    try {
      await this.authorService.delete(id);
      res.status(HttpStatus.ACCEPTED).send({ message: 'Author deleted' });
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).send(error.message);
    }
  }
}
