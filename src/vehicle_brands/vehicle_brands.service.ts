import { Injectable } from '@nestjs/common';
import { CreateVehicleBrandDto } from './dto/create-vehicle_brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle_brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleBrand } from './entities/vehicle_brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleBrandsService {
  constructor(
    @InjectRepository(VehicleBrand)
    private vehicleBrandsRepository: Repository<VehicleBrand>,
  ) {}
  async create(createVehicleBrandDto: CreateVehicleBrandDto) {
    return await this.vehicleBrandsRepository
      .save(createVehicleBrandDto)
      .then((vehicleBrand) => {
        return vehicleBrand;
      })
      .catch((error) => {
        console.error('Error creating vehicle brand:', error);
        throw new Error('Failed to create vehicle brand');
      });
  }

  async findAll():Promise<VehicleBrand[]| string> {
    return await this.vehicleBrandsRepository
      .find({
        order: {
          brand_id: 'ASC', 
        },
        relations: ['vehicles'],
      })
      .then((vehicleBrands) => {
        if (vehicleBrands.length === 0) {
          return 'No vehicle brands found.';
        }
        return vehicleBrands;
      })
      .catch((error) => {
        console.error('Error retrieving vehicle brands:', error);
        throw new Error('Failed to retrieve vehicle brands.');
      });
  }

  async findOne(id: number):Promise<VehicleBrand | string> {
    return await this.vehicleBrandsRepository
      .findOne({ where: { brand_id: id } })
      .then((vehicleBrand) => {
        if (!vehicleBrand) {
          return `Vehicle brand with ID ${id} not found.`;
        }
        return vehicleBrand;
      })
      .catch((error) => {
        console.error('Error retrieving vehicle brand:', error);
        throw new Error(`Failed to retrieve vehicle brand with ID ${id}.`);
      });
  }

  async update(id: number, updateVehicleBrandDto: UpdateVehicleBrandDto) :Promise< string>{
    return await this.vehicleBrandsRepository
      .update(id, updateVehicleBrandDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Vehicle brand with ID ${id} not found for update.`;
        }
        return `Vehicle brand with ID ${id} updated successfully.`;
      })
      .catch((error) => {
        console.error('Error updating vehicle brand:', error);
        throw new Error(`Failed to update vehicle brand with ID ${id}.`);
      });
  }

  async remove(id: number):Promise<string> {
    return await this.vehicleBrandsRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Vehicle brand with ID ${id} not found.`;
        }
        return `Vehicle brand with ID ${id} deleted successfully.`;
      })
      .catch((error) => {
        console.error('Error deleting vehicle brand:', error);
        throw new Error(`Failed to delete vehicle brand with ID ${id}.`);
      });
  }
}
