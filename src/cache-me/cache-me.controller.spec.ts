import { Test, TestingModule } from '@nestjs/testing';
import { CacheMeController } from './cache-me.controller';
import { CacheMeService } from './cache-me.service';

describe('CacheMeController', () => {
  let controller: CacheMeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacheMeController],
      providers: [CacheMeService],
    }).compile();

    controller = module.get<CacheMeController>(CacheMeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
