import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { mockReview } from './review.service.spec';
import { mockResponse } from '../../shared/dto/mock-response.dto';
import { HttpStatus } from '@nestjs/common';

const mockReviewService = {
  create: jest.fn().mockResolvedValue(mockReview),
  update: jest.fn().mockResolvedValue(mockReview),
  remove: jest.fn().mockResolvedValue(true),
};

describe('ReviewController', () => {
  let controller: ReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewService,
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Create a new review
  describe('create', () => {
    it('should return a new review', async () => {
      const res = mockResponse();
      await controller.create(mockReview, res);

      expect(mockReviewService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Review created successfully',
      });
    });
  });

  // Update a review
  describe('update', () => {
    it('should update a review', async () => {
      const res = mockResponse();
      await controller.update('1', mockReview, res);

      expect(mockReviewService.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Review updated successfully',
      });
    });
  });

  // Remove a review
  describe('remove', () => {
    it('should remove a review', async () => {
      const res = mockResponse();
      await controller.remove('1', res);

      expect(mockReviewService.remove).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Review deleted successfully',
      });
    });
  });
});
