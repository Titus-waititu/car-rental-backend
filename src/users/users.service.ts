import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<string> {
    const userEntity = this.usersRepository.create(createUserDto);
    try {
      const user: User = await this.usersRepository.save(userEntity);
      return `User with ID ${user.user_id} created successfully.`;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user.');
    }
  }

  async findAll(): Promise<User[] | string> {
    return await this.usersRepository
      .find({
        order: { user_id: 'ASC' },
        relations: ['subscribers', 'bookings', 'ratings', 'testimonials','contactus','payments'],
      })
      .then((users) => {
        if (users.length === 0) {
          return [];
        }
        return users;
      })
      .catch((error) => {
        console.error('Error retrieving users:', error);
        throw new Error('Failed to retrieve users.');
      });
  }

  async findOne(id: number):Promise <User | string> {
    return await this.usersRepository
      .findOne({ where: { user_id: id }, relations: ['subscribers', 'bookings', 'ratings', 'testimonials','contactus','payments'] })
      .then((user) => {
        if (!user) {
          return `User with ID ${id} not found.`;
        }
        return user;
      })
      .catch((error) => {
        console.error('Error retrieving user:', error);
        throw new Error(`Failed to retrieve user with ID ${id}.`);
      });
  }

  async update(id: number, updateUserDto: UpdateUserDto) :Promise<string>{
    return await this.usersRepository
      .update(id, updateUserDto)
      .then((result) => {
        if (result.affected === 0) {
          return `User with ID ${id} not found or no changes made.`;
        }
        return `User with ID ${id} updated successfully.`;
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        throw new Error(`Failed to update user with ID ${id}.`);
      });
  }

  async remove(id: number):Promise<string> {
    return await this.usersRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `User with ID ${id} not found.`;
        }
        return `User with ID ${id} deleted successfully.`;
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        throw new Error(`Failed to delete user with ID ${id}.`);
      });
  }
}
