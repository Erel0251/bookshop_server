import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './constants/order-status.enum';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { QueryOrderDto } from './dto/query-order.dto';

export const mockOrderDetail: CreateOrderDetailDto = {
  price: 100,
  discount: 10,
  quantity: 1,
  total_price: 90,
  book_id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
};

export const mockOrder: CreateOrderDto = {
  id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  user_id: 'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
  name: 'test',
  province: 'test',
  district: 'test',
  ward: 'test',
  address: 'test',
  phone: 'test',
  email: 'test@gmail.com',
  status: OrderStatus.PENDING,
  order_details: [],
};

export const mockOrderRepository = {
  create: jest.fn(() => mockOrder),
  save: jest.fn(() => mockOrder),
  update: jest.fn(() => mockOrder),
  find: jest.fn(() => [mockOrder]),
  findOne: jest.fn(() => mockOrder),
  findAll: jest.fn(() => [mockOrder]),
  delete: jest.fn(() => mockOrder),
  remove: jest.fn(() => mockOrder),
  updateStatusOrder: jest.fn(() => mockOrder),
  findOrderDetails: jest.fn(() => [mockOrderDetail]),
  addOrderDetail: jest.fn(() => mockOrderDetail),
  removeOrderDetail: jest.fn(() => mockOrderDetail),
};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create an order
  it('should create an order', async () => {
    const order = await service.create(mockOrder);
    expect(order).toEqual(mockOrder);
  });

  // Find all orders
  it('should return all orders', async () => {
    const req = new QueryOrderDto({
      name: 'test',
      email: '',
    });
    expect(await service.findAll(req)).toEqual([mockOrder]);
  });

  // Find one order
  it('should return one order', async () => {
    expect(
      await service.findOne('c7d0c154-bd0f-4d78-b4cf-697eee7b61a2'),
    ).toEqual(mockOrder);
  });

  // Update an order status
  it('should update an order status', async () => {
    const order = await service.updateStatusOrder(
      'c7d0c154-bd0f-4d78-b4cf-697eee7b61a2',
      mockOrder,
    );
    expect(order).toEqual(mockOrder);
  });
});
