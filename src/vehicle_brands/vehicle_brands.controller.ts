import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VehicleBrandsService } from './vehicle_brands.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle_brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle_brand.dto';

@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly vehicleBrandsService: VehicleBrandsService) {}

  @Post()
  create(@Body() createVehicleBrandDto: CreateVehicleBrandDto) {
    return this.vehicleBrandsService.create(createVehicleBrandDto);
  }

  @Get()
  findAll() {
    return this.vehicleBrandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.vehicleBrandsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id',ParseIntPipe) id: number,
    @Body() updateVehicleBrandDto: UpdateVehicleBrandDto,
  ) {
    return this.vehicleBrandsService.update(id, updateVehicleBrandDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.vehicleBrandsService.remove(id);
  }
}
