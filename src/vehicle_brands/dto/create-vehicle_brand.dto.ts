import { IsDateString, IsNumber, IsString } from 'class-validator'


export class CreateVehicleBrandDto {
    @IsNumber()
    brand_id:number;

    @IsString()
    brand_name:string;

    @IsDateString()
    created_at:Date
}
