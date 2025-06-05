import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the user who is subscribing',
    example: 1,
  })
  userId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the guest user who is subscribing',
    example: 2,
    required: false,
  })
  guestUserId?: number;

  @IsEmail()
  @ApiProperty({
    description: 'The email address of the subscriber',
    example: 'example@gmail.com',
  })
  email: string;

  @IsDateString()
  @ApiProperty({
    description: 'The date when the user subscribed',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  subscribed_at: Date;
}
