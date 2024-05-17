import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
