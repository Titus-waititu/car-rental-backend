import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleBrand } from 'src/vehicle_brands/entities/vehicle_brand.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(VehicleBrand) private vehicleBrandRepository: Repository<VehicleBrand>,
  ) {}
  async create(createVehicleDto: CreateVehicleDto) {
    const vehicleBrand = await this.vehicleBrandRepository.findOne({
      where: { brand_id: createVehicleDto.vehicle_brandId },
    });
    if (!vehicleBrand) {
      throw new Error(`Vehicle brand with ID ${createVehicleDto.vehicle_brandId} not found.`);
    }
    const vehicle = this.vehiclesRepository.create({
      ...createVehicleDto,
      vehicle_brand: vehicleBrand,
    });
    return this.vehiclesRepository
      .save(vehicle)
      .then((savedVehicle) => {
        return `Vehicle with ID ${savedVehicle.vehicle_id} created successfully.`;
      })
      .catch((error) => {
        console.error('Error creating vehicle:', error);
        throw new Error('Failed to create vehicle.');
      });
  }

  async findAll(): Promise<Vehicle[] | string> {
    return await this.vehiclesRepository
      .find({
        order: {
          vehicle_id: 'ASC', // Sort by vehicle_id in ascending order
        },
        relations: ['vehicle_brand'],
      })
      .then((vehicles) => {
        if (vehicles.length === 0) {
          return 'No vehicles found.';
        }
        return vehicles;
      })
      .catch((error) => {
        console.error('Error retrieving vehicles:', error);
        throw new Error('Failed to retrieve vehicles.');
      });
  }

  async findOne(id: number): Promise<Vehicle | string> {
    return await this.vehiclesRepository
      .findOne({
        where: { vehicle_id: id },
        relations: ['vehicle_brand'],
      })
      .then((vehicle) => {
        if (!vehicle) {
          return `Vehicle with ID ${id} not found.`;
        }
        return vehicle;
      })
      .catch((error) => {
        console.error('Error retrieving vehicle:', error);
        throw new Error(`Failed to retrieve vehicle with ID ${id}.`);
      });
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<string> {
    return await this.vehiclesRepository
      .update(id, updateVehicleDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Vehicle with ID ${id} not found for update.`;
        }
        return `Vehicle with ID ${id} updated successfully.`;
      })
      .catch((error) => {
        console.error('Error updating vehicle:', error);
        throw new Error(`Failed to update vehicle with ID ${id}.`);
      });
  }

  async remove(id: number): Promise<string> {
    return await this.vehiclesRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Vehicle with ID ${id} not found.`;
        }
        return `Vehicle with ID ${id} deleted successfully.`;
      })
      .catch((error) => {
        console.error('Error deleting vehicle:', error);
        throw new Error(`Failed to delete vehicle with ID ${id}.`);
      });
  }
}
