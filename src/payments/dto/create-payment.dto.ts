import { IsNumber, IsDateString, IsEnum } from 'class-validator';

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
  @IsNumber()
  userId: number;

  @IsNumber()
  bookingId: number;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsNumber()
  transactionId: number;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;

  @IsDateString()
  paymeny_date: Date;
}
