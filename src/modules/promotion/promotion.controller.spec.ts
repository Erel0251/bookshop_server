import { Test, TestingModule } from '@nestjs/testing';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { BookService } from '../book/book.service';
import { mockPromotion, mockPromotionBook } from './promotion.service.spec';
import { mockBook, mockBookService } from '../book/book.controller.spec';
import { mockResponse } from '../../shared/dto/mock-response.dto';
import { HttpStatus } from '@nestjs/common';
import { UpdatePromotionBookDto } from './dto/update-promotion-book.dto';

const mockPromotionService = {
  create: jest.fn().mockResolvedValue(mockPromotion),
  findAll: jest.fn().mockResolvedValue([mockPromotion]),
  findOne: jest.fn().mockResolvedValue(mockPromotion),
  findType: jest.fn().mockResolvedValue([mockPromotion]),
  findDetailPromotion: jest.fn().mockResolvedValue([mockPromotionBook]),
  update: jest.fn().mockResolvedValue(mockPromotion),
  remove: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true),
  addBookToPromotion: jest.fn().mockResolvedValue(true),
  createPromotionBook: jest.fn().mockResolvedValue(true),
  updatePromotionBook: jest.fn().mockResolvedValue(true),
  deletePromotionBook: jest.fn().mockResolvedValue(true),
  removeBookFromPromotion: jest.fn().mockResolvedValue(true),
};

describe('PromotionController', () => {
  let controller: PromotionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionController],
      providers: [
        {
          provide: PromotionService,
          useValue: mockPromotionService,
        },
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<PromotionController>(PromotionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Create a new promotion event
  describe('create', () => {
    it('should return a new promotion event', async () => {
      const res = mockResponse();
      await controller.create(mockPromotion, res);

      expect(mockPromotionService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Create promotion successfully',
      });
    });
  });

  // Get all promotion events
  describe('findAll', () => {
    it('should return an array of promotion events', async () => {
      const res = mockResponse();
      await controller.findAll(res);

      expect(mockPromotionService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.render).toHaveBeenCalledWith('promotion', {
        title: 'Promotion',
        promotions: [mockPromotion],
      });
    });
  });

  // Get specific promotion event
  describe('findOne', () => {
    it('should return a specific promotion event', async () => {
      const res = mockResponse();
      await controller.findOne(mockPromotion.id, res);

      expect(mockPromotionService.findOne).toHaveBeenCalled();
      expect(mockBookService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.render).toHaveBeenCalledWith('detailPromotion', {
        title: 'Promotion Detail',
        promotion: mockPromotion,
        books: [mockBook],
      });
    });
  });

  // Update specific promotion event
  describe('update', () => {
    it('should update a specific promotion event', async () => {
      const res = mockResponse();
      await controller.update(mockPromotion.id, mockPromotion, res);

      expect(mockPromotionService.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Update promotion successfully',
      });
    });
  });

  // Delete specific promotion event
  describe('remove', () => {
    it('should delete a specific promotion event', async () => {
      const res = mockResponse();
      await controller.delete(mockPromotion.id, res);

      expect(mockPromotionService.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Delete promotion successfully',
      });
    });
  });

  // Add a book to a promotion event
  describe('addBookToPromotion', () => {
    it('should add a book to a promotion event', async () => {
      const res = mockResponse();
      await controller.createPromotionBook(
        mockPromotionBook.promotion_id,
        mockPromotionBook.book_id,
        mockPromotionBook,
        res,
      );

      expect(mockPromotionService.createPromotionBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Add book to promotion successfully',
      });
    });
  });

  // Update specific promotion book
  describe('updatePromotionBook', () => {
    it('should update a specific promotion book', async () => {
      const res = mockResponse();
      await controller.updatePromotionBook(
        mockPromotionBook.book_id,
        mockPromotionBook.promotion_id,
        mockPromotionBook as UpdatePromotionBookDto,
        res,
      );

      expect(mockPromotionService.updatePromotionBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Update promotion book successfully',
      });
    });
  });

  // Delete specific promotion book
  describe('removeBookFromPromotion', () => {
    it('should delete a specific promotion book', async () => {
      const res = mockResponse();
      await controller.deletePromotionBook(
        mockPromotionBook.book_id,
        mockPromotionBook.promotion_id,
        res,
      );

      expect(mockPromotionService.deletePromotionBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Delete promotion book successfully',
      });
    });
  });
});
