import { IsDate, IsDateString, IsEnum, IsNumber } from 'class-validator';

export enum BookingStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

export class CreateBookingDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  vehicleId: number;

  @IsNumber()
  paymentId: number;

  @IsDateString()
  booking_date: Date;

  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsDateString()
  return_date: Date;
}
