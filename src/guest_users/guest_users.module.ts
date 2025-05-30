import { Module } from '@nestjs/common';
import { GuestUsersService } from './guest_users.service';
import { GuestUsersController } from './guest_users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestUser } from './entities/guest_user.entity';
import { ContactUsQuery } from 'src/contact_us_queries/entities/contact_us_query.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([GuestUser, ContactUsQuery, Subscriber]),
  ],
  controllers: [GuestUsersController],
  providers: [GuestUsersService],
})
export class GuestUsersModule {}
