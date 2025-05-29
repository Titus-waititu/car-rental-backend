import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber) private subscribersRepository: Repository<Subscriber>,
   ) {}
  async create(createSubscriberDto: CreateSubscriberDto) {
    return this.subscribersRepository.save(createSubscriberDto).then((subscriber) => {
      return subscriber;
    }).catch((error) => {
      console.error('Error creating subscriber:', error);
      throw new Error('Failed to create subscriber');
    }
    );
  }

  async findAll() {
    return this.subscribersRepository.find().then((subscribers) => {
      if (subscribers.length === 0) {
        return 'No subscribers found.';
      }
      return subscribers;
    }).catch((error) => {
      console.error('Error retrieving subscribers:', error);
      throw new Error('Failed to retrieve subscribers.');
    });
  }

  async findOne(id: number) {
    return this.subscribersRepository.findOne({ where: { subscriber_id: id } }).then((subscriber) => {
      if (!subscriber) {
        return `Subscriber with ID ${id} not found.`;
      }
      return subscriber;
    }
    ).catch((error) => {
      console.error('Error retrieving subscriber:', error);
      throw new Error(`Failed to retrieve subscriber with ID ${id}.`);
    }
    );
  }

  async update(id: number, updateSubscriberDto: UpdateSubscriberDto) {
    return this.subscribersRepository.update(id, updateSubscriberDto).then((result) => {
      if (result.affected === 0) {
        return `Subscriber with ID ${id} not found or no changes made.`;
      }
      return `Subscriber with ID ${id} updated successfully.`;
    }
    ).catch((error) => {
      console.error('Error updating subscriber:', error);
      throw new Error(`Failed to update subscriber with ID ${id}.`);
    }
    );
  }

  async remove(id: number) {
    return this.subscribersRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        return `Subscriber with ID ${id} not found.`;
      }
      return `Subscriber with ID ${id} deleted successfully.`;
    }
    ).catch((error) => {
      console.error('Error deleting subscriber:', error);
      throw new Error(`Failed to delete subscriber with ID ${id}.`);
    }
    );
  }
}
