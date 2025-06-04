import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Relation,
} from 'typeorm';

export enum BookingStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @Column({ type: 'timestamp' })
  booking_date: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.pending,
  })
  status: BookingStatus;

  @Column({ type: 'timestamp' })
  return_date: Date;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user: Relation<User>;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.booking, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  vehicle: Relation<Vehicle>;

  @OneToOne(() => Payment, (payment) => payment.booking, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  payment: Relation<Payment>;
}
