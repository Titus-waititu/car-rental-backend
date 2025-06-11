import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';

export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export enum PaymentMethod {
  CreditCard = 'Credit Card',
  PayPal = 'PayPal',
  BankTransfer = 'Bank Transfer',
  Cash = 'Cash',
  MPesa = 'MPesa',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CreditCard,
  })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  merchantRequestId: string;

  @Column({ nullable: true })
  checkoutRequestId: string;

  @Column({ nullable: true })
  resultCode: string;

  @Column({ nullable: true })
  resultDesc: string;

  @Column({ nullable: true })
  mpesaReceiptNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  balance: number;

  @Column({ type: 'timestamp', nullable: true })
  transactionDate: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  payment_date: Date;

  @OneToOne(() => Booking, (booking) => booking.payment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  booking: Relation<Booking>;

  @ManyToOne(() => User, (user) => user.payments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user: Relation<User>;
}
