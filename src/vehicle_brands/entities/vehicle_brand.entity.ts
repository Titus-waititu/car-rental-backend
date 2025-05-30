import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class VehicleBrand {
  @PrimaryGeneratedColumn()
  brand_id: number;

  @Column()
  brand_name: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicle_brand)
  @JoinColumn()
  vehicles: Vehicle[];
}
