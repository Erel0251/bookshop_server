import { Test, TestingModule } from '@nestjs/testing';
import { SupplementService } from './supplement.service';
import { BookService } from '../book/book.service';
import { AuthModule } from '../auth/auth.module';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { CreateSupplementDetailDto } from './dto/create-supplement-detail.dto';

export const mockSupplement: CreateSupplementDto = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  name: 'Supplement 1',
  description: 'Description 1',
  total_quantity: 100,
  total_price: 1000,
  currency: 'VND',
  supplier: 'Supplier 1',
  date: new Date(),
};

const mockDetailSupplement: CreateSupplementDetailDto = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  quantity: 100,
  price: 1000,
  currency: 'VND',
};

const mockSupplementRepository = {
  create: jest.fn().mockResolvedValue(mockSupplement),
  save: jest.fn().mockResolvedValue(mockSupplement),
  findOne: jest.fn().mockResolvedValue(mockSupplement),
  findAll: jest.fn().mockResolvedValue([mockSupplement]),
  update: jest.fn().mockResolvedValue(true),
  remove: jest.fn().mockResolvedValue(true),
  createDetailById: jest.fn().mockResolvedValue(undefined),
  addBook: jest.fn().mockResolvedValue(undefined),
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
    getMany: jest.fn().mockResolvedValue([mockSupplement]),
  })),
};

describe('SupplementService', () => {
  let service: SupplementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SupplementService,
          useValue: mockSupplementRepository,
        },
        {
          provide: BookService,
          useValue: {},
        },
        {
          provide: AuthModule,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SupplementService>(SupplementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create supplement
  it('should create a supplement', async () => {
    const res = await service.create(mockSupplement);
    expect(res).toEqual(mockSupplement);
  });

  // Create detail by id
  it('should create a detail by id', async () => {
    const res = await service.createDetailById(
      mockSupplement.id,
      mockDetailSupplement,
    );
    expect(res).toEqual(undefined);
  });

  // Find all supplements
  it('should return all supplements', async () => {
    expect(await service.findAll(undefined)).toEqual([mockSupplement]);
  });

  // Find one supplement
  it('should return one supplement', async () => {
    expect(await service.findOne(mockSupplement.id)).toEqual(mockSupplement);
  });

  // Update supplement
  it('should update a supplement', async () => {
    const res = await service.update(mockSupplement.id, mockSupplement);
    expect(res).toEqual(true);
  });

  // Remove supplement
  it('should remove a supplement', async () => {
    const res = await service.remove(mockSupplement.id);
    expect(res).toEqual(true);
  });

  // Add book
  it('should add a book', async () => {
    const res = await service.addBook(mockSupplement.id, {
      id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
      supplement_detail: mockDetailSupplement,
    });
    expect(res).toEqual(undefined);
  });
});
