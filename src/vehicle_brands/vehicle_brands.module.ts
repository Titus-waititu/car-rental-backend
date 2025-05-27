import { Module } from '@nestjs/common';
import { VehicleBrandsService } from './vehicle_brands.service';
import { VehicleBrandsController } from './vehicle_brands.controller';

@Module({
  controllers: [VehicleBrandsController],
  providers: [VehicleBrandsService],
})
export class VehicleBrandsModule {}
