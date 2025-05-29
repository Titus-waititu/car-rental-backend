import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Subscriber])],
  controllers: [SubscribersController],
  providers: [SubscribersService],
})
export class SubscribersModule {}
