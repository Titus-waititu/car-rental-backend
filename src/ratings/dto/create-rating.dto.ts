import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  vehicleId: number;

  @IsNumber()
  rating_value: number;

  @IsString()
  review: string;

  @IsDateString()
  created_at: Date;
}
