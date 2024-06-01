import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { mockBook } from '../book/book.controller.spec';
import { Book } from '../book/entities/book.entity';

export const mockReview: CreateReviewDto = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  title: 'Review 1',
  comment: 'Comment 1',
  rating: 5,
};

export const mockReviewRepository = {
  create: jest.fn().mockResolvedValue(mockReview),
  update: jest.fn().mockResolvedValue(mockReview),
  remove: jest.fn().mockResolvedValue(true),
  findReviewByBook: jest.fn().mockResolvedValue([mockReview]),
};

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create a new review
  it('should create a review', async () => {
    const res = await service.create(mockReview);
    expect(res).toEqual(mockReview);
  });

  // Update a review
  it('should update a review', async () => {
    const res = await service.update(mockReview.id, mockReview);
    expect(res).toEqual(mockReview);
  });

  // Remove a review
  it('should remove a review', async () => {
    const res = await service.remove(mockReview.id);
    expect(res).toEqual(true);
  });

  // Find review by book
  it('should find review by book', async () => {
    const res = await service.findReviewByBook(mockBook as Book);
    expect(res).toEqual([mockReview]);
  });
});
