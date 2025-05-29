import { Module } from '@nestjs/common';
import { ContactUsQueriesService } from './contact_us_queries.service';
import { ContactUsQueriesController } from './contact_us_queries.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUsQuery } from './entities/contact_us_query.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ContactUsQuery])],
  controllers: [ContactUsQueriesController],
  providers: [ContactUsQueriesService],
})
export class ContactUsQueriesModule {}
