import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

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

@Entity()
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

  @Column()
  transactionId: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  payment_status: PaymentStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  payment_date: Date;

  @OneToOne(() => Booking, (book) => book.payment,{onDelete: 'CASCADE'})
  @JoinColumn()
  booking: Relation<Booking>;

  @ManyToOne(() => User, (user) => user.payments,{onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  user: Relation<User>;
}
