import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum BookingStatus {
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  booking_id: number;


  @Column()
  user_id: number;

  @Column()
  vehicle_id: number;

  @Column({ type: 'timestamp' })
  booking_date: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
  })
  status: BookingStatus;

  @Column({ type: 'timestamp' })
  return_date: Date;
}
