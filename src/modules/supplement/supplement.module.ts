import { Module } from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { SupplementController } from './supplement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplement } from './entities/supplement.entity';
import { SupplementDetail } from './entities/supplement-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplement, SupplementDetail])],
  controllers: [SupplementController],
  providers: [SupplementService],
  exports: [SupplementService],
})
export class SupplementModule {}
