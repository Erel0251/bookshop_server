import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { CreateRatingDto } from './dto/create-rating.dto';
// import { UpdateRatingDto } from './dto/update-rating.dto';

import { Book } from '../book/entities/book.entity';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService {
  constructor() {} // private rating: Repository<Rating>, // @InjectRepository(Rating)

  create() {
    return 'This action adds a new rating';
  }

  findAll() {
    return `This action returns all rating`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rating`;
  }

  update(id: number) {
    return `This action updates a #${id} rating`;
  }

  async findRatingByBook(book: Book): Promise<Rating[]> {
    return await Rating.find({ where: { book } });
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
