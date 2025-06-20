import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  //helper methods

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private excludeSensitiveData(user: User): Partial<User> {
    const { password, hashedRefreshToken, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      select: ['user_id', 'email'],
    });

    if (existingUser) {
      throw new Error(`User with email ${createUserDto.email} already exists.`);
    }

    const newUser = {
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    };
    const savedUser = await this.usersRepository
      .save(newUser)
      .then((user) => {
        return user;
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user.');
      });
    return this.excludeSensitiveData(savedUser);
  }

  async findAll(search?: string): Promise<Partial<User[] | string>> {
    if (search) {
      const cleanSearch = search?.toLocaleLowerCase().trim();
      const users = await this.usersRepository.find({
        where: [
          { first_name: ILike(`%${cleanSearch}%`) },
          { last_name: ILike(`%${cleanSearch}%`) },
          { email: ILike(`%${cleanSearch}%`) },
        ],
        select: [
          'user_id',
          'first_name',
          'last_name',
          'email',
          'last_login',
          'phone_number',
          'profile_picture',
          'role',
          'status',
        ],
        order: { user_id: 'ASC' },
        relations: {
          subscribers: true,
          bookings: true,
          ratings: true,
          testimonials: true,
          contactus: true,
          payments: true,
        },
      });
      if (users.length === 0) {
        return `No users found matching the search term "${search}".`;
      }
      return users;
    }
    return await this.usersRepository
      .find({
        order: { user_id: 'ASC' },
        relations: {
          subscribers: true,
          bookings: true,
          ratings: true,
          testimonials: true,
          contactus: true,
          payments: true,
        },
        select: [
          'user_id',
          'first_name',
          'last_name',
          'email',
          'last_login',
          'phone_number',
          'profile_picture',
          'role',
          'status',
        ],
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

  async findOne(id: number): Promise<User | string> {
    return await this.usersRepository
      .findOne({
        where: { user_id: id },
        select: [
          'user_id',
          'first_name',
          'last_name',
          'email',
          'last_login',
          'phone_number',
          'profile_picture',
          'role',
          'status',
        ],
        order: { user_id: 'ASC' },
        relations: {
          subscribers: true,
          bookings: true,
          ratings: true,
          testimonials: true,
          contactus: true,
          payments: true,
        },
      })
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<string> {
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

  async remove(id: number): Promise<string> {
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
