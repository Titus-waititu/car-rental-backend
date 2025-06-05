import { Controller, Post, HttpStatus, HttpCode, Logger } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Seed endpoint called');
    return this.seedService.seed();
  }
}
