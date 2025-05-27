import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  subscriber_id: number;

  @Column()
  email: string;

  @Column({ type: 'timestamp' })
  subscribed_at: Date;
}
