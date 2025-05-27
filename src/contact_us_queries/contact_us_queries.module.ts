import { Module } from '@nestjs/common';
import { ContactUsQueriesService } from './contact_us_queries.service';
import { ContactUsQueriesController } from './contact_us_queries.controller';

@Module({
  controllers: [ContactUsQueriesController],
  providers: [ContactUsQueriesService],
})
export class ContactUsQueriesModule {}
