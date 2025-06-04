import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

export enum QueryStatus {
  resolved = 'resolved',
  pending = 'pending',
}

@Entity()
export class ContactUsQuery {
  @PrimaryGeneratedColumn()
  query_id: number;

  @Column()
  query_message: string;

  @Column({
    type: 'enum',
    enum: QueryStatus,
  })
  status: QueryStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.contactus, { nullable: true,onDelete: 'CASCADE' })
  @JoinColumn()
  user: Relation<User>;

  @ManyToOne(() => GuestUser, (guest) => guest.contactus, { nullable: true,onDelete: 'CASCADE' })
  @JoinColumn()
  guest: Relation<GuestUser>;
}
