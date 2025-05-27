import { Injectable } from '@nestjs/common';
import { CreateVehicleBrandDto } from './dto/create-vehicle_brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle_brand.dto';

@Injectable()
export class VehicleBrandsService {
  create(createVehicleBrandDto: CreateVehicleBrandDto) {
    return 'This action adds a new vehicleBrand';
  }

  findAll() {
    return `This action returns all vehicleBrands`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicleBrand`;
  }

  update(id: number, updateVehicleBrandDto: UpdateVehicleBrandDto) {
    return `This action updates a #${id} vehicleBrand`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicleBrand`;
  }
}
