import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the user who is giving the rating',
    example: 1,
  })
  userId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The ID of the vehicle being rated',
    example: 101,
  })
  vehicleId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The rating value given to the vehicle',
    example: 4.5,
  })
  rating_value: number;

  @IsString()
  @ApiProperty({
    description: 'The review text provided by the user',
    example: 'Great vehicle, very comfortable!',
  })
  review: string;

  @IsDateString()
  @ApiProperty({
    description: 'The date when the rating was created',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  created_at: Date;
}
