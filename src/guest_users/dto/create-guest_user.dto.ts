import { IsNumber, IsString } from 'class-validator'


export class CreateGuestUserDto {
    @IsNumber()
    guest_id:number;

    @IsString()
    email:string;

    @IsString()
    first_name:string;

    @IsString()
    last_name:string;

    @IsString()
    phone_number:string;
}
