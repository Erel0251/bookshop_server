import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookResolver } from './book.resolver';
import { Book } from './entities/book.entity';

import { CategoryModule } from '../category/category.module';
import { ReviewModule } from '../review/review.module';
import { PromotionModule } from '../promotion/promotion.module';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    ReviewModule,
    CategoryModule,
    PromotionModule,
    CloudinaryModule,
  ],
  controllers: [BookController],
  providers: [BookService, BookResolver],
  exports: [BookService],
})
export class BookModule {}
