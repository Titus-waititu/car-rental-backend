import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  rating_id: number;

  @Column({ type: 'int' })
  rating_value: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.ratings)
  @JoinColumn()
  vehicle: Vehicle;
}
