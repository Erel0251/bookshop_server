import { Test, TestingModule } from '@nestjs/testing';
import { SupplementController } from './supplement.controller';
import { SupplementService } from './supplement.service';
import { BookService } from '../book/book.service';

describe('SupplementController', () => {
  let controller: SupplementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplementController],
      providers: [
        {
          provide: SupplementService,
          useValue: {},
        },
        {
          provide: BookService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SupplementController>(SupplementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
