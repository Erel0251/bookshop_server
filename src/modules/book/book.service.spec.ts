import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookStatus } from './constants/status.enum';
import { ReviewService } from '../review/review.service';
import { PromotionService } from '../promotion/promotion.service';
import { CategoryService } from '../category/category.service';

const mockBook: CreateBookDto = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  title: 'test',
  author: 'test',
  publisher: 'test',
  img_urls: ['test'],
  price: 100,
  status: BookStatus.AVAILABLE,
  currency: 'VND',
};

export const mockBookRepository = {
  create: jest.fn().mockResolvedValue(mockBook),
  save: jest.fn().mockResolvedValue(mockBook),
  findOne: jest.fn().mockResolvedValue(mockBook),
  findAll: jest.fn().mockResolvedValue([mockBook]),
  update: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn(),
    andWhere: jest.fn(),
    orderBy: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    groupBy: jest.fn(),
    having: jest.fn(),
    select: jest.fn(),
    addSelect: jest.fn(),
    addOrderBy: jest.fn(),
    offset: jest.fn(),
    limit: jest.fn(),
    getMany: jest.fn().mockResolvedValue([mockBook]),
  })),
};

describe('BookService', () => {
  let service: BookService;
  //let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: CategoryService,
          useValue: {},
        },
        {
          provide: ReviewService,
          useValue: {},
        },
        {
          provide: PromotionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    //repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create a book
  it('should create a book', async () => {
    const book = await service.create(mockBook);
    expect(book).toEqual(mockBook);
  });

  // Find one book
  it('should return one book', async () => {
    expect(
      await service.findOne('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2'),
    ).toEqual(mockBook);
  });

  // Update a book
  it('should update a book', async () => {
    const updatedBook = await service.update(
      'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
      mockBook,
    );
    expect(updatedBook).toBeUndefined();
  });

  // Delete a book
  it('should delete a book', async () => {
    const deletedBook = await service.delete(
      'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
    );
    expect(deletedBook).toBeUndefined();
  });
});
