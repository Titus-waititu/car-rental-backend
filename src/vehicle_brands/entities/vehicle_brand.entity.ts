import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VehicleBrand {
  @PrimaryGeneratedColumn()
  brand_id: number;

  @Column()
  brand_name: string;

  @Column({ type: 'timestamp' })
  created_at: Date;
}
