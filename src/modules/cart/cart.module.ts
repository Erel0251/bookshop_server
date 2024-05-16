import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { CartDetail } from './entities/cart-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartDetail])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
