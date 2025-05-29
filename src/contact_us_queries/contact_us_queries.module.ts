import { Module } from '@nestjs/common';
import { ContactUsQueriesService } from './contact_us_queries.service';
import { ContactUsQueriesController } from './contact_us_queries.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUsQuery } from './entities/contact_us_query.entity';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ContactUsQuery,GuestUser,User])],
  controllers: [ContactUsQueriesController],
  providers: [ContactUsQueriesService],
})
export class ContactUsQueriesModule {}
