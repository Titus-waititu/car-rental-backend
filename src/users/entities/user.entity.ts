import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  amail: string;

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

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;
}
