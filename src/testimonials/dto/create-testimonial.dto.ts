import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';

export enum TestimonialStatus {
  active = 'active',
  inactive = 'inactive',
}

export class CreateTestimonialDto {
  @IsNumber()
  userId: number;

  @IsString()
  testimonial: string;

  @IsEnum(TestimonialStatus)
  status: TestimonialStatus;

  @IsDateString()
  created_at: Date;
}
