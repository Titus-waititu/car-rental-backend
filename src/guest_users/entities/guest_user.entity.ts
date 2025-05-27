import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GuestUser {
  @PrimaryGeneratedColumn()
  guest_id: number;

  @Column()
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;
}
