import { IsDate, IsDateString, IsEmail, IsNumber, IsString } from 'class-validator'

export class CreateAdminDto {
    @IsNumber()
    admin_id:number

    @IsString()
    username:string

    @IsString()
    password:string

    @IsEmail()
    email:string

    @IsDateString()
    last_login:Date
}
