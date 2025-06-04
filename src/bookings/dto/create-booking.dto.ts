import { IsDateString, IsEnum, IsNumber } from 'class-validator';

export enum BookingStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

export class CreateBookingDto {
  @IsDateString()
  booking_date: Date;

  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsDateString()
  return_date: Date;

  @IsNumber()
  userId: number;

  @IsNumber()
  vehicleId: number;
}
