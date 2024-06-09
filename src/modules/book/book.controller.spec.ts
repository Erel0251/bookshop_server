import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookStatus } from './constants/status.enum';
import { HttpStatus } from '@nestjs/common';
import { Book } from './entities/book.entity';
import { mockResponse } from '../../shared/dto/mock-response.dto';
import { mockUploadedFile } from '../../shared/cloudinary/cloudinary.service.spec';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';

export const mockBook: CreateBookDto | Book = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  title: 'test',
  author: 'test',
  publisher: 'test',
  img_urls: ['test'],
  price: 100,
  status: BookStatus.AVAILABLE,
  currency: 'VND',
};

export const mockBookService = {
  create: jest.fn().mockResolvedValue(mockBook),
  findAll: jest.fn().mockResolvedValue([mockBook]),
  findOne: jest.fn().mockResolvedValue(mockBook),
  update: jest.fn().mockResolvedValue(mockBook),
  remove: jest.fn().mockResolvedValue(true),
};

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue({
              secure_url: 'test',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Create a book
  describe('create', () => {
    it('should return a book', async () => {
      const res = mockResponse();

      await controller.create(mockBook as CreateBookDto, mockUploadedFile, res);

      expect(service.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Create book successfully',
      });
    });
  });

  // Find all books
  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [mockBook as Book];
      const res = mockResponse();
      await controller.findAll(undefined, res);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.render).toHaveBeenCalledWith('book', {
        title: 'Book',
        message: 'Get data successfully',
        books: result,
        statuses: Object.values(BookStatus),
      });
    });
  });

  // Find a book by id
  describe('findOne', () => {
    it('should return a book', async () => {
      const res = mockResponse();
      await controller.findOne('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2', res);

      expect(service.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockBook);
    });
  });

  // Update a book
  describe('update', () => {
    it('should return a book', async () => {
      const res = mockResponse();
      await controller.update(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        mockBook as CreateBookDto,
        mockUploadedFile,
        res,
      );

      expect(service.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Update book successfully',
      });
    });
  });
});
