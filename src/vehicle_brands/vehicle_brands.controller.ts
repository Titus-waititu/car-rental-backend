import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { VehicleBrandsService } from './vehicle_brands.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle_brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle_brand.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('vehicle brands')
@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly vehicleBrandsService: VehicleBrandsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createVehicleBrandDto: CreateVehicleBrandDto) {
    return this.vehicleBrandsService.create(createVehicleBrandDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.vehicleBrandsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleBrandsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleBrandDto: UpdateVehicleBrandDto,
  ) {
    return this.vehicleBrandsService.update(id, updateVehicleBrandDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleBrandsService.remove(id);
  }
}
