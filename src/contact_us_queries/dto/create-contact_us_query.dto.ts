import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum QueryStatus {
  resolved = 'resolved',
  pending = 'pending',
}

export class CreateContactUsQueryDto {
  @ApiProperty({
    description: 'The ID of the guest making the query',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  guestId?: number;

  @IsNumber()
  @ApiProperty({
    description: 'The ID of the user making the query',
    example: 2,
    required: false,
  })
  @IsOptional()
  userId?: number;

  @IsString()
  @ApiProperty({
    description: 'The message of the query',
    example: 'I have a question about vehicle availability.',
  })
  query_message: string;

  @IsEnum(QueryStatus)
  @ApiProperty({
    description: 'The status of the query',
    enum: QueryStatus,
    default: QueryStatus.pending,
    required: false,
  })
  @IsOptional()
  status?: QueryStatus;

  @IsDateString()
  @ApiProperty({
    description: 'The date when the query was created',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  created_at?: Date;
}
