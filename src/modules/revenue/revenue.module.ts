import { Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { Order } from '../order/entities/order.entity';
import { Supplement } from '../supplement/entities/supplement.entity';
import { SupplementDetail } from '../supplement/entities/supplement-detail.entity';
import { OrderDetail } from '../order/entities/order-detail.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Book,
      Category,
      Order,
      OrderDetail,
      Supplement,
      SupplementDetail,
    ]),
  ],
  controllers: [RevenueController],
  providers: [RevenueService],
})
export class RevenueModule {}
