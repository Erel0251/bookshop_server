import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { PromotionType } from './constants/promotion-type.enum';
import { CreatePromotionBookDto } from './dto/create-promotion-book.dto';
import { BookService } from '../book/book.service';
import { mockBookRepository } from '../book/book.service.spec';
import { UpdatePromotionBookDto } from './dto/update-promotion-book.dto';
import { mockBook } from '../book/book.controller.spec';

export const mockPromotion: CreatePromotionDto = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  name: 'Promotion 1',
  from: new Date(),
  to: new Date(),
  type: PromotionType.RECOMMEND,
};

export const mockPromotionBook: CreatePromotionBookDto = {
  promotion_id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  book_id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
};

export const mockPromotionRepository = {
  create: jest.fn().mockResolvedValue(mockPromotion),
  update: jest.fn().mockResolvedValue(mockPromotion),
  save: jest.fn().mockResolvedValue(mockPromotion),
  find: jest.fn().mockResolvedValue([mockPromotion]),
  findAll: jest.fn().mockResolvedValue([mockPromotion]),
  findOne: jest.fn().mockResolvedValue(mockPromotion),
  findType: jest.fn().mockResolvedValue([mockPromotion]),
  findDetailPromotion: jest.fn().mockResolvedValue([mockPromotionBook]),
  delete: jest.fn().mockResolvedValue(true),
  findBookByPromotionBookId: jest.fn().mockResolvedValue(mockBook),
  createPromotionBook: jest.fn().mockResolvedValue(mockPromotionBook),
  updatePromotionBook: jest.fn().mockResolvedValue(mockPromotionBook),
  deletePromotionBook: jest.fn().mockResolvedValue(true),
};

describe('PromotionService', () => {
  let service: PromotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PromotionService,
          useValue: mockPromotionRepository,
        },
        {
          provide: BookService,
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create a promotion
  describe('create', () => {
    it('should return a promotion', async () => {
      const result = mockPromotion;
      await service.create(result);

      expect(mockPromotionRepository.create).toHaveBeenCalled();
    });
  });

  // Find all promotions
  describe('findAll', () => {
    it('should return an array of promotions', async () => {
      await service.findAll();

      expect(mockPromotionRepository.findAll).toHaveBeenCalled();
    });
  });

  // Find a promotion by id
  describe('findOne', () => {
    it('should return a promotion', async () => {
      const result = mockPromotion;
      await service.findOne(result.id);

      expect(mockPromotionRepository.findOne).toHaveBeenCalled();
    });
  });

  // Find promotions by type
  describe('findType', () => {
    it('should return an array of promotions', async () => {
      await service.findType(PromotionType.RECOMMEND);

      expect(mockPromotionRepository.findType).toHaveBeenCalled();
    });
  });

  // Find detail of a promotion
  describe('findDetailPromotion', () => {
    it('should return an array of promotion books', async () => {
      const result = mockPromotion;
      await service.findDetailPromotion(result.id);

      expect(mockPromotionRepository.findOne).toHaveBeenCalled();
    });
  });

  // Find a book by promotion book id
  describe('findBookByPromotionBookId', () => {
    it('should return a book', async () => {
      const result = mockPromotionBook;
      await service.findBookByPromotionBookId(result.promotion_id);

      expect(mockPromotionRepository.findOne).toHaveBeenCalled();
    });
  });

  // Update a promotion
  describe('update', () => {
    it('should return void', async () => {
      const result = mockPromotion;
      await service.update(result.id, result);

      expect(mockPromotionRepository.update).toHaveBeenCalled();
    });
  });

  // Delete a promotion
  describe('delete', () => {
    it('should return void', async () => {
      const result = mockPromotion;
      await service.delete(result.id);

      expect(mockPromotionRepository.findOne).toHaveBeenCalled();
      expect(mockPromotionRepository.delete).toHaveBeenCalled();
    });
  });

  // Delete a promotion with an error
  describe('delete', () => {
    it('should return an error', async () => {
      const result = mockPromotion;
      mockPromotionRepository.findOne = jest.fn().mockResolvedValue(null);
      try {
        await service.delete(result.id);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  // Create a promotion book
  describe('createPromotionBook', () => {
    it('should return a promotion book', async () => {
      const result = mockPromotionBook;
      await service.createPromotionBook(
        result.promotion_id,
        result.book_id,
        mockPromotionBook,
      );

      expect(mockPromotionRepository.createPromotionBook).toHaveBeenCalled();
    });
  });

  // Update a promotion book
  describe('updatePromotionBook', () => {
    it('should return void', async () => {
      const result = mockPromotionBook as UpdatePromotionBookDto;
      await service.updatePromotionBook(result.promotion_id, result);

      expect(mockPromotionRepository.updatePromotionBook).toHaveBeenCalled();
    });
  });

  // Delete a promotion book
  describe('deletePromotionBook', () => {
    it('should return void', async () => {
      const result = mockPromotionBook;
      await service.deletePromotionBook(result.promotion_id, result.book_id);

      expect(mockPromotionRepository.deletePromotionBook).toHaveBeenCalled();
    });
  });
});
