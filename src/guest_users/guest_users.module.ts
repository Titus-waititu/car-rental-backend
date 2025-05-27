import { Module } from '@nestjs/common';
import { GuestUsersService } from './guest_users.service';
import { GuestUsersController } from './guest_users.controller';

@Module({
  controllers: [GuestUsersController],
  providers: [GuestUsersService],
})
export class GuestUsersModule {}
