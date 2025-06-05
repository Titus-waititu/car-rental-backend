import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'The unique identifier for the vehicle brand',
    example: 1,
  })
  @IsNumber()
  vehicle_brandId: number;

  @ApiProperty({
    description: 'Model of the vehicle',
    example: 'Toyota Corolla',
    required: true,
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'The color of the vehicle',
    example: 'Red',
    required: false,
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'Rental price per day in USD',
    example: 45.99,
    required: true,
  })
  @IsNumber()
  price_per_day: number;

  @ApiProperty({
    description: 'Vehicle availability status',
    example: true,
    required: true,
  })
  @IsBoolean()
  availability: boolean;

  @ApiProperty({
    description: 'Creation date of the vehicle record',
    example: '2025-06-01T00:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  created_at: Date;
}
