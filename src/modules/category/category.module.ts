import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { BookModule } from '../book/book.module';
import { CategoryResolver } from './category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => BookModule)],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
