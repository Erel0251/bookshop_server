import { Test, TestingModule } from '@nestjs/testing';
import { SupplementController } from './supplement.controller';
import { SupplementService } from './supplement.service';
import { BookService } from '../book/book.service';
import { mockResponse } from '../../shared/dto/mock-response.dto';
import { mockSupplement } from './supplement.service.spec';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { HttpStatus } from '@nestjs/common';
import { mockBook } from '../book/book.controller.spec';

const mockSupplementService = {
  create: jest.fn().mockResolvedValue(mockSupplement),
  findAll: jest.fn().mockResolvedValue([mockSupplement]),
  findOne: jest.fn().mockResolvedValue(mockSupplement),
  update: jest.fn().mockResolvedValue(mockSupplement),
  remove: jest.fn().mockResolvedValue(true),
  addBook: jest.fn().mockResolvedValue(true),
  updateBook: jest.fn().mockResolvedValue(true),
  removeBook: jest.fn().mockResolvedValue(true),
  updateDetail: jest.fn().mockResolvedValue(true),
};

describe('SupplementController', () => {
  let controller: SupplementController;
  let service: SupplementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplementController],
      providers: [
        {
          provide: SupplementService,
          useValue: mockSupplementService,
        },
        {
          provide: BookService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockBook]),
          },
        },
      ],
    }).compile();

    controller = module.get<SupplementController>(SupplementController);
    service = module.get<SupplementService>(SupplementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Create a new supplement
  describe('create', () => {
    it('should return a supplement', async () => {
      const res = mockResponse();
      await controller.create(mockSupplement as CreateSupplementDto, res);

      expect(service.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Create supplement successfully',
      });
    });
  });

  // Get all supplements
  describe('findAll', () => {
    it('should return an array of supplements', async () => {
      const res = mockResponse();
      await controller.findAll({}, res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.render).toHaveBeenCalledWith('supplement', {
        title: 'Supplement',
        message: 'Get data successfully',
        supplements: [mockSupplement],
      });
    });
  });

  // Get a supplement by id
  describe('findOne', () => {
    it('should return a supplement', async () => {
      const res = mockResponse();
      await controller.findOne('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2', res);

      expect(service.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
    });
  });

  // Update a supplement
  describe('update', () => {
    it('should return a supplement', async () => {
      const res = mockResponse();
      await controller.update(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        mockSupplement as CreateSupplementDto,
        res,
      );

      expect(service.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Update supplement successfully',
      });
    });
  });

  // Remove a supplement
  describe('remove', () => {
    it('should return true', async () => {
      const res = mockResponse();
      await controller.remove('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2', res);

      expect(service.remove).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Delete supplement successfully',
      });
    });
  });

  // Add a book to a supplement
  describe('addBook', () => {
    it('should return true', async () => {
      const res = mockResponse();
      await controller.addBook(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        mockBook,
        res,
      );

      expect(service.addBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Add book to supplement successfully',
      });
    });
  });

  // Remove a book from a supplement
  describe('removeBook', () => {
    it('should return true', async () => {
      const res = mockResponse();
      await controller.removeBook(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        res,
      );

      expect(service.removeBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Remove book from supplement successfully',
      });
    });
  });

  // Update a detail in a supplement
  describe('updateDetail', () => {
    it('should return true', async () => {
      const res = mockResponse();
      await controller.updateBook(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        mockSupplement as CreateSupplementDto,
        res,
      );

      expect(service.updateDetail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Update detail supplement successfully',
      });
    });
  });

  // Remove a detail from a supplement
  describe('removeDetail', () => {
    it('should return true', async () => {
      const res = mockResponse();
      await controller.removeBook(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        res,
      );

      expect(service.removeBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Remove book from supplement successfully',
      });
    });
  });
});
