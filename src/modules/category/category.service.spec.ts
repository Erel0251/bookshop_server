import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { mockBook } from '../book/book.controller.spec';
import { Book } from '../book/entities/book.entity';

export const mockCategory: CreateCategoryDto = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  name: 'test',
  description: 'test',
};

const mockCategoryRepository = {
  create: jest.fn(() => mockCategory),
  save: jest.fn(() => mockCategory),
  update: jest.fn(() => mockCategory),
  find: jest.fn(() => [mockCategory]),
  findOne: jest.fn(() => mockCategory),
  findAll: jest.fn(() => [mockCategory]),
  delete: jest.fn(() => mockCategory),
  remove: jest.fn(() => mockCategory),
  findChildrenCategory: jest.fn(() => [mockCategory]),
  findFatherCategory: jest.fn(() => mockCategory),
  findBooksByCategory: jest.fn(() => [mockCategory]),
  addBookToCategory: jest.fn(() => mockCategory),
  removeBookFromCategory: jest.fn(() => mockCategory),
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create a category
  it('should create a category', async () => {
    const category = await service.create(mockCategory);
    expect(category).toEqual(mockCategory);
  });

  // Find all categories
  it('should return all categories', async () => {
    expect(await service.findAll()).toEqual([mockCategory]);
  });

  // Find one category
  it('should return one category', async () => {
    expect(
      await service.findOne('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2'),
    ).toEqual(mockCategory);
  });

  // Update a category
  it('should update a category', async () => {
    const category = await service.update(
      'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
      mockCategory as UpdateCategoryDto,
    );
    expect(category).toEqual(mockCategory);
  });

  // Remove a category
  it('should remove a category', async () => {
    const category = await service.remove(
      'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
    );
    expect(category).toEqual(mockCategory);
  });

  // Find children categories
  it('should return children categories', async () => {
    expect(
      await service.findChildrenCategory(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
      ),
    ).toEqual([mockCategory]);
  });

  // Find father category
  it('should return father category', async () => {
    expect(
      await service.findFatherCategory('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2'),
    ).toEqual(mockCategory);
  });

  // Find Book by Category
  it('should return books by category', async () => {
    expect(
      await service.findBooksByCategory('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2'),
    ).toEqual([mockCategory]);
  });

  // Add Book to Category
  it('should add book to category', async () => {
    expect(
      await service.addBookToCategory(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        mockBook as Book,
      ),
    ).toEqual(mockCategory);
  });

  // Remove Book from Category
  it('should remove book from category', async () => {
    expect(
      await service.removeBookFromCategory(
        'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
        mockBook as Book,
      ),
    ).toEqual(mockCategory);
  });
});
