import { Booking } from 'src/bookings/entities/booking.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { VehicleBrand } from 'src/vehicle_brands/entities/vehicle_brand.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  vehicle_id: number;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column('decimal')
  price_per_day: number;

  @Column()
  availability: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => VehicleBrand, (brand) => brand.vehicles,{onDelete: 'CASCADE'})
  vehicle_brand: Relation<VehicleBrand>;

  @OneToOne(() => Booking, (booking) => booking.vehicle)
  booking: Relation<Booking>;

  @OneToMany(() => Rating, (rating) => rating.vehicle)
  ratings: Relation<Rating[]>;
}
