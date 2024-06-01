import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

const mockCart: CreateCartDto = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  user_id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  book_id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  quantity: 1,
};

const mockCartRepository = {
  create: jest.fn(() => mockCart),
  save: jest.fn(() => mockCart),
  update: jest.fn(() => mockCart),
  find: jest.fn(() => [mockCart]),
  findOne: jest.fn(() => mockCart),
  delete: jest.fn(() => mockCart),
  remove: jest.fn(() => mockCart),
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useValue: mockCartRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create a cart
  it('should create a cart item', async () => {
    const cart = await service.create(mockCart);
    expect(cart).toEqual(mockCart);
  });

  // Update a cart
  it('should update a cart item', async () => {
    const cart = await service.update(mockCart as UpdateCartDto);
    expect(cart).toEqual(mockCart);
  });

  // Remove a cart
  it('should remove a cart item', async () => {
    const cart = await service.remove(mockCart.user_id, mockCart.book_id);
    expect(cart).toEqual(mockCart);
  });
});
