import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateVehicleBrandDto {
  @IsString()
  @ApiProperty  ({
    description: 'The name of the vehicle brand',
    example: 'Toyota',
  })
  brand_name: string;

  @IsDateString()
  @ApiProperty({
    description: 'The date when the vehicle brand was created',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  created_at: Date;
}
