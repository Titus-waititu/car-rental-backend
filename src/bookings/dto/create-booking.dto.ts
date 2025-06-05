import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber } from 'class-validator';

export enum BookingStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

export class CreateBookingDto {
  @IsDateString()
  @ApiProperty({
    description: 'The date when the booking is made',
    example: '2023-10-01T12:00:00Z',
  })
  booking_date: Date;

  @IsEnum(BookingStatus)
  @ApiProperty({
    description: 'The status of the booking',
    enum: BookingStatus,
    default: BookingStatus.pending,
  })
  status: BookingStatus;

  @IsDateString()
  @ApiProperty({
    description: 'The date when the vehicle is to be returned',
    example: '2023-10-10T12:00:00Z',
  })
  return_date: Date;

  @IsNumber()
  @ApiProperty({
    description: 'The ID of the user making the booking',
    example: 1,
  })
  userId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The ID of the vehicle being booked',
    example: 101,
  })
  vehicleId: number;
}
