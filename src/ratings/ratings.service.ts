import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createRatingDto: CreateRatingDto) {

    const vehicle = await this.vehicleRepository.findOne({
      where: { vehicle_id: createRatingDto.vehicleId },
    });
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${createRatingDto.vehicleId} not found.`);
    }
    const user = await this.userRepository.findOne({
      where: { user_id: createRatingDto.userId },
    });
    if (!user) {
      throw new Error(`User with ID ${createRatingDto.userId} not found.`);
    }

    const rating = this.ratingsRepository.create({
      ...createRatingDto,
      vehicle: vehicle,
      user: user,
    });
    return this.ratingsRepository
      .save(rating)
      .then((savedRating) => {
        return `Rating with ID ${savedRating.rating_id} created successfully.`;
      })
      .catch((error) => {
        console.error('Error creating rating:', error);
        throw new Error('Failed to create rating.');
      });
  }

  async findAll(): Promise<Rating[] | string> {
    return this.ratingsRepository
      .find({
        order: { rating_id: 'ASC' },
        relations: {
          user: true,
          vehicle: true,
        },
      })
      .then((ratings) => {
        if (ratings.length === 0) {
          return 'No ratings found.';
        }
        return ratings;
      })
      .catch((error) => {
        console.error('Error retrieving ratings:', error);
        throw new Error('Failed to retrieve ratings.');
      });
  }

  async findOne(id: number): Promise<Rating | string> {
    return this.ratingsRepository
      .findOne({
        where: { rating_id: id },
        relations: {
          user: true,
          vehicle: true,
        },
        order: { rating_id: 'ASC' },
      })
      .then((rating) => {
        if (!rating) {
          return `Rating with ID ${id} not found.`;
        }
        return rating;
      })
      .catch((error) => {
        console.error('Error retrieving rating:', error);
        throw new Error(`Failed to retrieve rating with ID ${id}.`);
      });
  }

  async update(id: number, updateRatingDto: UpdateRatingDto): Promise<string> {
    return this.ratingsRepository
      .update(id, updateRatingDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Rating with ID ${id} not found for update.`;
        }
        return `Rating with ID ${id} updated successfully.`;
      })
      .catch((error) => {
        console.error('Error updating rating:', error);
        throw new Error(`Failed to update rating with ID ${id}.`);
      });
  }

  async remove(id: number): Promise<string> {
    return this.ratingsRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Rating with ID ${id} not found for deletion.`;
        }
        return `Rating with ID ${id} deleted successfully.`;
      })
      .catch((error) => {
        console.error('Error deleting rating:', error);
        throw new Error(`Failed to delete rating with ID ${id}.`);
      });
  }
}
