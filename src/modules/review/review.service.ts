import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    return await this.reviewRepository.save(createReviewDto);
  }

  async remove(id: string) {
    return await this.reviewRepository.delete(id);
  }

  findReviewByBook(book: Book) {
    return this.reviewRepository.find({ where: { book }, relations: ['user'] });
  }
}
