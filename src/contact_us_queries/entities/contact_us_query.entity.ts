import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum QueryStatus {
  resolved = 'resolved',
  pending = 'pending',
}

@Entity()
export class ContactUsQuery {
  @PrimaryGeneratedColumn()
  query_id: number;

  @Column()
  guest_user_id: number;

  @Column()
  user_id: number;

  @Column()
  query_message: string;

  @Column({
    type: 'enum',
    enum: QueryStatus,
  })
  status: QueryStatus;

  @Column({ type: 'timestamp' })
  created_at: Date;
}
