import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleBrand } from 'src/vehicle_brands/entities/vehicle_brand.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Rating } from 'src/ratings/entities/rating.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Vehicle,VehicleBrand,Booking,Rating])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
