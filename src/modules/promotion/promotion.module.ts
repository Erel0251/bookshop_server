import { Module, forwardRef } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { PromotionBook } from './entities/promotion-book.entity';
import { BookModule } from '../book/book.module';
import { AuthModule } from '../auth/auth.module';
import { PromotionResolver } from './promotion.resolver';
import { PromotionBookResolver } from './promotion-book.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion, PromotionBook]),
    forwardRef(() => BookModule),
    AuthModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService, PromotionResolver, PromotionBookResolver],
  exports: [PromotionService],
})
export class PromotionModule {}
