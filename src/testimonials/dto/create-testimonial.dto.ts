import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum TestimonialStatus {
  active = 'active',
  inactive = 'inactive',
}

export class CreateTestimonialDto {
  @ApiProperty({
    description: 'The ID of the user who is providing the testimonial',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @IsString()
  @ApiProperty({
    description: 'The testimonial text provided by the user',
    example: 'This service was fantastic! Highly recommend.',
  })
  testimonial: string;

  @IsEnum(TestimonialStatus)
  @ApiProperty({
    description: 'The status of the testimonial',
    enum: TestimonialStatus,
    default: TestimonialStatus.active,
  })
  status: TestimonialStatus;

  @IsDateString()
  @ApiProperty({
    description: 'The date when the testimonial was created',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  created_at: Date;
}
