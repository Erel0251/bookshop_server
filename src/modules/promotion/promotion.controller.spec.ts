import { Test, TestingModule } from '@nestjs/testing';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { BookService } from '../book/book.service';

describe('PromotionController', () => {
  let controller: PromotionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionController],
      providers: [
        {
          provide: PromotionService,
          useValue: {},
        },
        {
          provide: BookService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PromotionController>(PromotionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
