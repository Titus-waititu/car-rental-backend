import { IsDate, IsDateString, IsEnum, IsNumber, IsString } from 'class-validator'

export enum TestimonialStatus {
    active = 'active',
    inactive = 'inactive'
}

export class CreateTestimonialDto {
    @IsNumber()
    testimonial_id:number;

    @IsNumber()
    user_id:number;

    @IsString()
    testimonial:string;

    @IsEnum(TestimonialStatus)
    status:TestimonialStatus;

    @IsDateString()
    created_at:Date
}
