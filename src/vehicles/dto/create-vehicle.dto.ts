import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator'


export class CreateVehicleDto {
    @IsNumber()
    vehicle_id:number;

    @IsNumber()
    brand_id:number;

    @IsString()
    model:string;

    @IsString()
    color:string;

    @IsNumber()
    price_per_day:number

    @IsBoolean()
    availability:boolean;

    @IsDateString()
    created_at:Date
}
