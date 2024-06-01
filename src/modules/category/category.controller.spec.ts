import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { BookService } from '../book/book.service';
import { mockBook, mockBookService } from '../book/book.controller.spec';
import { mockCategory } from './category.service.spec';
import { mockResponse } from '../../shared/dto/mock-response.dto';
import { HttpStatus } from '@nestjs/common';

export const mockCategoryService = {
  create: jest.fn().mockResolvedValue(mockCategory),
  findAll: jest.fn().mockResolvedValue([mockCategory]),
  findOne: jest.fn().mockResolvedValue(mockCategory),
  update: jest.fn().mockResolvedValue(mockCategory),
  remove: jest.fn().mockResolvedValue(true),
  findBooksByCategory: jest.fn().mockResolvedValue([mockBook]),
  addBookToCategory: jest.fn().mockResolvedValue({}),
  removeBookFromCategory: jest.fn().mockResolvedValue({}),
};

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Create a category
  describe('create', () => {
    it('should return a category', async () => {
      const res = mockResponse();
      await controller.create(mockCategory, res);

      expect(mockCategoryService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Create category successfully',
      });
    });
  });

  // Find all categories
  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [mockCategory];
      const res = mockResponse();
      await controller.findAll(res);

      expect(mockCategoryService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.render).toHaveBeenCalledWith('category', {
        title: 'Category',
        message: 'Get data successfully',
        categories: result,
      });
    });
  });

  // Find one category
  describe('findOne', () => {
    it('should return a category', async () => {
      const res = mockResponse();
      await controller.findOne('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2', res);

      expect(mockCategoryService.findOne).toHaveBeenCalled();
      expect(mockBookService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.render).toHaveBeenCalledWith('detailCategory', {
        title: 'Category Detail',
        message: 'Get data successfully',
        category: mockCategory,
        books: [mockBook],
      });
    });
  });

  // Update a category
  describe('update', () => {
    it('should return a category', async () => {
      const res = mockResponse();
      await controller.update(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        mockCategory,
        res,
      );

      expect(mockCategoryService.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  // Remove a category
  describe('remove', () => {
    it('should return a category', async () => {
      const res = mockResponse();
      await controller.remove('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2', res);

      expect(mockCategoryService.remove).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Delete category successfully',
      });
    });
  });

  // Find books by category
  describe('findBooksByCategory', () => {
    it('should return an array of books', async () => {
      const res = mockResponse();
      await controller.findBooksByCategory(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        res,
      );

      expect(mockCategoryService.findBooksByCategory).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith([mockBook]);
    });
  });

  // Add book to category
  describe('addBookToCategory', () => {
    it('should return a category', async () => {
      const res = mockResponse();
      await controller.addBookToCategory(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        res,
      );

      expect(mockCategoryService.addBookToCategory).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  // Remove book from category
  describe('removeBookFromCategory', () => {
    it('should return a category', async () => {
      const res = mockResponse();
      await controller.removeBookFromCategory(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        res,
      );

      expect(mockCategoryService.removeBookFromCategory).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
