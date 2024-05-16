import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookResolver } from './book.resolver';
import { Book } from './entities/book.entity';

import { AuthorModule } from '../author/author.module';
import { RatingModule } from '../rating/rating.module';
import { CategoryModule } from '../category/category.module';
import { SaleModule } from '../sale/sale.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    AuthorModule,
    RatingModule,
    CategoryModule,
    SaleModule,
  ],
  controllers: [BookController],
  providers: [BookService, BookResolver],
  exports: [BookService],
})
export class BookModule {}
