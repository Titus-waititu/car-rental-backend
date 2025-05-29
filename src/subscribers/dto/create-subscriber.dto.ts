import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  guestUserId: number;

  @IsString()
  email: string;

  @IsDateString()
  subscribed_at: Date;
}
