import { Module, forwardRef } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { PromotionBook } from './entities/promotion-book.entity';
import { BookModule } from '../book/book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion, PromotionBook]),
    forwardRef(() => BookModule),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
