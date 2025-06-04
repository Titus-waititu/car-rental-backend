import { IsDateString, IsString } from 'class-validator';

export class CreateVehicleBrandDto {
  @IsString()
  brand_name: string;

  @IsDateString()
  created_at: Date;
}
