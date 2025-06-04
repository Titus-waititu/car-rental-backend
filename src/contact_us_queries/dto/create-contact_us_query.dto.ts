import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';

export enum QueryStatus {
  resolved = 'resolved',
  pending = 'pending',
}

export class CreateContactUsQueryDto {
  @IsNumber()
  guestId?: number;

  @IsNumber()
  userId?: number;

  @IsString()
  query_message: string;

  @IsEnum(QueryStatus)
  status?: QueryStatus;

  @IsDateString()
  created_at: Date;
}
