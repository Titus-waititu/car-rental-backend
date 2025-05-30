import { Module } from '@nestjs/common';
import { VehicleBrandsService } from './vehicle_brands.service';
import { VehicleBrandsController } from './vehicle_brands.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleBrand } from './entities/vehicle_brand.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([VehicleBrand, Vehicle])],
  controllers: [VehicleBrandsController],
  providers: [VehicleBrandsService],
})
export class VehicleBrandsModule {}
