import { IsDate, IsDateString, IsEnum, IsNumber } from 'class-validator'

export enum BookingStatus{
    confirmed = 'confirmed',
    cancelled = 'cancelled'
}

export class CreateBookingDto {
    @IsNumber()
    booking_id:number;

    @IsNumber()
    user_id:number;

    @IsNumber()
    vehicle_id:number;

    @IsDateString()
    booking_date:Date;

    @IsEnum(BookingStatus)
    status:BookingStatus;

    @IsDateString()
    return_date:Date
}
