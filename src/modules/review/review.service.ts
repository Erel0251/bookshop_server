import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Book } from '../book/entities/book.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    private readonly userService: UserService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    // check if user has already ordered the book

    // check if the review already exists
    const reviewExist = this.reviewRepository.findOne({
      where: {
        book: { id: createReviewDto.book_id },
        user: { id: createReviewDto.user_id },
      },
    });
    if (reviewExist) {
      return;
    }

    const book = await this.bookRepository.findOne({
      where: { id: createReviewDto.book_id },
    });
    const user = await this.userService.findOne(createReviewDto.user_id);
    const review = await this.reviewRepository.create(createReviewDto);
    review.book = book;
    review.user = user;
    await this.reviewRepository.save(review);
  }

  async update(id: string, updateReview: UpdateReviewDto) {
    return await this.reviewRepository.update(id, updateReview);
  }

  async remove(id: string) {
    return await this.reviewRepository.delete(id);
  }

  async findReviewByBook(book: Book) {
    return await this.reviewRepository.find({
      where: { book },
      relations: ['user'],
    });
  }

  async findBookReviews(req: QueryReviewDto) {
    const query = this.bookRepository.createQueryBuilder('book');
    query.leftJoinAndSelect('book.reviews', 'reviews');
    query.where('book.id = :id', { id: req.id });
    if (req.rating) {
      query.andWhere('reviews.rating = :rating', { rating: req.rating });
    }
    query.orderBy(`reviews.${req.sortBy}`, req.order);
    query.offset(req.offset);
    query.limit(req.limit);

    const book = await query.getOne();
    return book.reviews;
  }

  async findUserReview(review: Review) {
    const result = await this.reviewRepository.findOne({
      where: { id: review.id },
      relations: ['user'],
    });
    return result.user;
  }
}
