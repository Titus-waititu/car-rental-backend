import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  vehicle_id: number;

  @Column()
  brand_id: number;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column('decimal')
  price_per_day: number;

  @Column()
  availability: boolean;

  @Column({ type: 'timestamp' })
  created_at: Date;
}
