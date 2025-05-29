import { Payment } from 'src/payments/entities/payment.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Testimonial } from 'src/testimonials/entities/testimonial.entity';
import { ContactUsQuery } from 'src/contact_us_queries/entities/contact_us_query.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({unique:true})
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @Column()
  phone_number: string;

  @Column()
  profile_picture: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  last_login: Date;

  //retaltion to bookings table

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Testimonial, (test) => test.user)
  testimonial: Testimonial[];

  @OneToMany(() => ContactUsQuery, (contact) => contact.user)
  contactus: ContactUsQuery[];

  @OneToOne(() => Subscriber, (subscriber) => subscriber.user)
  subscriber: Subscriber;
}
