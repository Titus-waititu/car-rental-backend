import { Injectable } from '@nestjs/common';
import { CreateGuestUserDto } from './dto/create-guest_user.dto';
import { UpdateGuestUserDto } from './dto/update-guest_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestUser } from './entities/guest_user.entity';

@Injectable()
export class GuestUsersService {
  constructor(
    @InjectRepository(GuestUser)
    private guestRepository: Repository<GuestUser>,
  ) {}
  async create(createGuestUserDto: CreateGuestUserDto) {
    return await this.guestRepository
      .save(createGuestUserDto)
      .then((guestUser) => {
        return guestUser;
      })
      .catch((error) => {
        console.error('Error creating guest user:', error);
        throw new Error('Failed to create guest user.');
      });
  }

  async findAll(): Promise<GuestUser[] | string>  {
    return await this.guestRepository
      .find({
        order: {
          guest_id: 'ASC',
        },
        relations: {
          contactus:true,
          subscriber:true
        },
      })
      .then((guestUsers) => {
        if (guestUsers.length === 0) {
          return 'No guest users found.';
        }
        return guestUsers;
      })
      .catch((error) => {
        console.error('Error retrieving guest users:', error);
        throw new Error('Failed to retrieve guest users.');
      });
  }

  async findOne(id: number): Promise<GuestUser | string> {
    return await this.guestRepository
      .findOne({
        order: {
          guest_id: 'ASC',
        },
        where: { guest_id: id },
        relations: {
          contactus:true,
          subscriber:true
        },
      })
      .then((guestUser) => {
        if (!guestUser) {
          return `Guest user with ID ${id} not found.`;
        }
        return guestUser;
      })
      .catch((error) => {
        console.error('Error retrieving guest user:', error);
        throw new Error(`Failed to retrieve guest user with ID ${id}.`);
      });
  }

  async update(id: number, updateGuestUserDto: UpdateGuestUserDto):Promise<string> {
    return await this.guestRepository
      .update(id, updateGuestUserDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Guest user with ID ${id} not found or no changes made.`;
        }
        return `Guest user with ID ${id} updated successfully.`;
      })
      .catch((error) => {
        console.error('Error updating guest user:', error);
        throw new Error(`Failed to update guest user with ID ${id}.`);
      });
  }

  async remove(id: number):Promise<string> {
    return await this.guestRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Guest user with ID ${id} not found.`;
        }
        return `Guest user with ID ${id} removed successfully.`;
      })
      .catch((error) => {
        console.error('Error removing guest user:', error);
        throw new Error(`Failed to remove guest user with ID ${id}.`);
      });
  }
}
