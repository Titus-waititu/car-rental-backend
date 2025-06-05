import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber) private subscribersRepository: Repository<Subscriber>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(GuestUser) private guestRepository: Repository<GuestUser>,
  ) {}
  async create(createSubscriberDto: CreateSubscriberDto) {
    const user = await this.userRepository.findOne({
      where: { user_id: createSubscriberDto.userId },
    });
    if (!user) {
      throw new Error(`User with ID ${createSubscriberDto.userId} not found.`);
    }
    const guestUser = await this.guestRepository.findOne({
      where: { guest_id: createSubscriberDto.guestUserId },
    });
    if (!guestUser) {
      throw new Error(`Guest User with ID ${createSubscriberDto.guestUserId} not found.`);
    }
    const subscriber = this.subscribersRepository.create({
      ...createSubscriberDto,
      user: user,
      guestUser: guestUser,
    });
    return this.subscribersRepository
      .save(subscriber)
      .then((savedSubscriber) => {
        return `Subscriber with ID ${savedSubscriber.subscriber_id} created successfully.`;
      })
      .catch((error) => {
        console.error('Error creating subscriber:', error);
        throw new Error('Failed to create subscriber.');
      });
  }

  async findAll(): Promise<Subscriber[] | string> {
    return this.subscribersRepository
      .find({
        order: {
          subscriber_id: 'ASC',
        },
        relations: {
          user: true,
          guestUser: true,
        },
      })
      .then((subscribers) => {
        if (subscribers.length === 0) {
          return 'No subscribers found.';
        }
        return subscribers;
      })
      .catch((error) => {
        console.error('Error retrieving subscribers:', error);
        throw new Error('Failed to retrieve subscribers.');
      });
  }

  async findOne(id: number): Promise<Subscriber | string> {
    return this.subscribersRepository
      .findOne({
        where: { subscriber_id: id },
        relations: {
          user: true,
          guestUser: true,
        },
        order: { subscriber_id: 'ASC' },
      })
      .then((subscriber) => {
        if (!subscriber) {
          return `Subscriber with ID ${id} not found.`;
        }
        return subscriber;
      })
      .catch((error) => {
        console.error('Error retrieving subscriber:', error);
        throw new Error(`Failed to retrieve subscriber with ID ${id}.`);
      });
  }

  async update(
    id: number,
    updateSubscriberDto: UpdateSubscriberDto,
  ): Promise<string> {
    return this.subscribersRepository
      .update(id, updateSubscriberDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Subscriber with ID ${id} not found or no changes made.`;
        }
        return `Subscriber with ID ${id} updated successfully.`;
      })
      .catch((error) => {
        console.error('Error updating subscriber:', error);
        throw new Error(`Failed to update subscriber with ID ${id}.`);
      });
  }

  async remove(id: number): Promise<string> {
    return this.subscribersRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Subscriber with ID ${id} not found.`;
        }
        return `Subscriber with ID ${id} deleted successfully.`;
      })
      .catch((error) => {
        console.error('Error deleting subscriber:', error);
        throw new Error(`Failed to delete subscriber with ID ${id}.`);
      });
  }
}
