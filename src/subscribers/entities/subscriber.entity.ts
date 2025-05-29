import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  subscriber_id: number;

  @Column({unique:true})
  email: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  subscribed_at: Date;

  @OneToOne(() => User, (user) => user.subscriber)
  @JoinColumn()
  user: User;

  @OneToOne(() => GuestUser, (guest) => guest.subscriber)
  @JoinColumn()
  guestUser: GuestUser;
}
