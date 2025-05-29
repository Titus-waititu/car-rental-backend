import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsNumber()
  vehicle_brand: number;

  @IsString()
  model: string;

  @IsString()
  color: string;

  @IsNumber()
  price_per_day: number;

  @IsBoolean()
  availability: boolean;

  @IsDateString()
  created_at: Date;
}
