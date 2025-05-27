import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator'

export class CreateSubscriberDto {
    @IsNumber()
    subscriber_id:number;

    @IsString()
    email:string;

    @IsDateString()
    subscribed_at:Date
}
