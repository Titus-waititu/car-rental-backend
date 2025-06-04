import { Test, TestingModule } from '@nestjs/testing';
import { CacheMeService } from './cache-me.service';

describe('CacheMeService', () => {
  let service: CacheMeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheMeService],
    }).compile();

    service = module.get<CacheMeService>(CacheMeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
