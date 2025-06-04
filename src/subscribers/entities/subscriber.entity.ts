import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  subscriber_id: number;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  subscribed_at: Date;

  @OneToOne(() => User, (user) => user.subscribers, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user: Relation<User>;

  @OneToOne(() => GuestUser, (guest) => guest.subscriber, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  guestUser: Relation<GuestUser>;
}
