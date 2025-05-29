import { Module } from '@nestjs/common';
import { GuestUsersService } from './guest_users.service';
import { GuestUsersController } from './guest_users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestUser } from './entities/guest_user.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([GuestUser])],
  controllers: [GuestUsersController],
  providers: [GuestUsersService],
})
export class GuestUsersModule {}
