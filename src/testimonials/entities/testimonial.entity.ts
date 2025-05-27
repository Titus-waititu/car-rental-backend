import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TestimonialStatus {
  active = 'active',
  inactive = 'inactive',
}

@Entity()
export class Testimonial {
  @PrimaryGeneratedColumn()
  testimonial_id: number;

  @Column()
  user_id: number;

  @Column()
  testimonial: string;

  @Column({
    type: 'enum',
    enum: TestimonialStatus,
  })
  status: TestimonialStatus;

  @Column({ type: 'timestamp' })
  created_at: Date;
}
