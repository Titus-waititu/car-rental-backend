import { IsDateString
, IsEnum, IsNumber, IsString } from 'class-validator'

export enum QueryStatus {
    resolved = 'resolved',
    pending = 'pending'
}

export class CreateContactUsQueryDto {
    @IsNumber()
    query_id:number;

    @IsNumber()
    guest_user_id:number;

    @IsNumber()
    user_id:number;

    @IsString()
    query_message:string;

    @IsEnum(QueryStatus)
    status:QueryStatus;

    @IsDateString()
    created_at:Date
}
