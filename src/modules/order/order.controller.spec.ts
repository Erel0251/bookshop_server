import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { mockOrder } from './order.service.spec';
import { mockResponse } from '../../shared/dto/mock-response.dto';

const mockOrderService = {
  create: jest.fn().mockResolvedValue(mockOrder),
  findAll: jest.fn().mockResolvedValue([mockOrder]),
  findOne: jest.fn().mockResolvedValue(mockOrder),
  update: jest.fn().mockResolvedValue(mockOrder),
  remove: jest.fn().mockResolvedValue(true),
  updateStatusOrder: jest.fn().mockResolvedValue(mockOrder),
};

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Create an order
  describe('create', () => {
    it('should return an order', async () => {
      const result = mockOrder;
      await controller.create(result);

      expect(mockOrderService.create).toHaveBeenCalled();
    });
  });

  // Find all orders
  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const res = mockResponse();
      await controller.findAll(res);

      expect(mockOrderService.findAll).toHaveBeenCalled();
    });
  });

  // Find an order by id
  describe('findOne', () => {
    it('should return an order', async () => {
      const result = mockOrder;
      await controller.findOne(result.id);

      expect(mockOrderService.findOne).toHaveBeenCalled();
    });
  });

  // Update status of an order
  describe('update', () => {
    it('should return an order', async () => {
      const result = mockOrder;
      await controller.update(result.id, result);

      expect(mockOrderService.updateStatusOrder).toHaveBeenCalled();
    });
  });
});
