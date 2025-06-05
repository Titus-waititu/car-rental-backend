import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
}

export enum PaymentMethod {
  CreditCard = 'Credit Card',
  PayPal = 'PayPal',
  BankTransfer = 'Bank Transfer',
  Cash = 'Cash',
  MPesa = 'MPesa',
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The ID of the user making the payment',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The ID of the booking associated with the payment',
    example: 123,
  })
  bookingId: number;

  @IsEnum(PaymentMethod)
  @ApiProperty({
    description: 'The method of payment used',
    enum: PaymentMethod,
    example: PaymentMethod.CreditCard,
  })
  payment_method: PaymentMethod;

  @IsNumber()
  @ApiProperty({
    description: 'The unique transaction ID for the payment',
    example: 456789,
  })
  transactionId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The amount paid in the transaction',
    example: 150.0,
  })
  amount: number;

  @IsEnum(PaymentStatus)
  @ApiProperty({
    description: 'The status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.Completed,
  })
  payment_status: PaymentStatus;

  @IsDateString()
  @ApiProperty({
    description: 'The date when the payment was made',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  payment_date: Date;
}
