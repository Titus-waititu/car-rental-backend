import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleBrandDto } from './create-vehicle_brand.dto';

export class UpdateVehicleBrandDto extends PartialType(CreateVehicleBrandDto) {}
