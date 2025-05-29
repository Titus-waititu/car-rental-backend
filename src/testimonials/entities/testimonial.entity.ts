import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum TestimonialStatus {
  active = 'active',
  inactive = 'inactive',
}

@Entity()
export class Testimonial {
  @PrimaryGeneratedColumn()
  testimonial_id: number;

  @Column()
  testimonial: string;

  @Column({
    type: 'enum',
    enum: TestimonialStatus,
  })
  status: TestimonialStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.testimonial)
  @JoinColumn()
  user: User;
}
