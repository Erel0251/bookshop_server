import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity';
import { AuthorModule } from '../author/author.module';
import { BookResolver } from './book.resolver';
import { RatingModule } from '../rating/rating.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorModule, RatingModule],
  controllers: [BookController],
  providers: [BookService, BookResolver],
  exports: [BookService],
})
export class BookModule {}
