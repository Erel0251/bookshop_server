import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleBook } from './entities/sale-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleBook])],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
