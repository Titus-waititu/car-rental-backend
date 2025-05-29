import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
  ) {}
  async create(createRatingDto: CreateRatingDto) {
    return this.ratingsRepository
        .save(createRatingDto)
        .then((rating) => {
          return `Rating with ID ${rating.rating_id} created successfully.`;
        })
        .catch((error) => {
          console.error('Error creating rating:', error);
          throw new Error('Failed to create rating.');
        }); 
  }

  async findAll() {
    return this.ratingsRepository
        .find()
        .then((ratings) => {
          if (ratings.length === 0) {
            return 'No ratings found.';
          }
          return ratings;
        }
        )
        .catch((error) => {
          console.error('Error retrieving ratings:', error);
          throw new Error('Failed to retrieve ratings.');
        }
    );
  }

  async findOne(id: number) {
    return this.ratingsRepository
        .findOne({ where: { rating_id: id } })
        .then((rating) => {
          if (!rating) {
            return `Rating with ID ${id} not found.`;
          }
          return rating;
        }
        )
        .catch((error) => {
          console.error('Error retrieving rating:', error);
          throw new Error(`Failed to retrieve rating with ID ${id}.`);
        }
    );
  }

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    return this.ratingsRepository
        .update(id, updateRatingDto)
        .then((result) => {
          if (result.affected === 0) {
            return `Rating with ID ${id} not found for update.`;
          }
          return `Rating with ID ${id} updated successfully.`;
        }
        )
        .catch((error) => {
          console.error('Error updating rating:', error);
          throw new Error(`Failed to update rating with ID ${id}.`);
        }
    );
  }

  async remove(id: number) {
    return this.ratingsRepository
        .delete(id)
        .then((result) => {
          if (result.affected === 0) {
            return `Rating with ID ${id} not found for deletion.`;
          }
          return `Rating with ID ${id} deleted successfully.`;
        }
        )
        .catch((error) => {
          console.error('Error deleting rating:', error);
          throw new Error(`Failed to delete rating with ID ${id}.`);
        }
    );
  }
}
