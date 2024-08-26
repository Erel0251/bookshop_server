import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';
import { BookModule } from '../book/book.module';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
  imports: [BookModule, PromotionModule],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}
