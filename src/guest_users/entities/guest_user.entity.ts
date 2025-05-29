import { ContactUsQuery } from 'src/contact_us_queries/entities/contact_us_query.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class GuestUser {
  @PrimaryGeneratedColumn()
  guest_id: number;

  @Column({unique:true})
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @OneToMany(() => ContactUsQuery, (contact) => contact.guest)
  contactus: ContactUsQuery[];

  @OneToOne(() => Subscriber, (subscriber) => subscriber.guestUser)
  subscriber: Subscriber;

  // @OneToMany(()=>ContactUsQuery)
}
