import { Injectable } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial) private testimonialsRepository: Repository<Testimonial>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createTestimonialDto: CreateTestimonialDto) {
    const user = await this.userRepository.findOne({
      where: { user_id: createTestimonialDto.userId },
    });
    if (!user) {
      throw new Error(`User with ID ${createTestimonialDto.userId} not found.`);
    }
    const testimonial = this.testimonialsRepository.create({
      ...createTestimonialDto,
      user: user,
    });
    return this.testimonialsRepository
      .save(testimonial)
      .then((savedTestimonial) => {
        return `Testimonial with ID ${savedTestimonial.testimonial_id} created successfully.`;
      })
      .catch((error) => {
        console.error('Error creating testimonial:', error);
        throw new Error('Failed to create testimonial.');
      });
  }

  async findAll(): Promise<Testimonial[] | string> {
    return await this.testimonialsRepository
      .find({
        order: {
          testimonial_id: 'ASC',
        },
        relations: {
          user: true,
        },
      })
      .then((testimonials) => {
        if (testimonials.length === 0) {
          return 'No testimonials found.';
        }
        return testimonials;
      })
      .catch((error) => {
        console.error('Error retrieving testimonials:', error);
        throw new Error('Failed to retrieve testimonials.');
      });
  }

  async findOne(id: number): Promise<Testimonial | string> {
    return await this.testimonialsRepository
      .findOne({
        where: { testimonial_id: id },
        relations: {
          user: true,
        },
      })
      .then((testimonial) => {
        if (!testimonial) {
          return `Testimonial with ID ${id} not found.`;
        }
        return testimonial;
      })
      .catch((error) => {
        console.error('Error retrieving testimonial:', error);
        throw new Error(`Failed to retrieve testimonial with ID ${id}.`);
      });
  }

  async update(
    id: number,
    updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<string> {
    return await this.testimonialsRepository
      .update(id, updateTestimonialDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Testimonial with ID ${id} not found for update.`;
        }
        return `Testimonial with ID ${id} updated successfully.`;
      })
      .catch((error) => {
        console.error('Error updating testimonial:', error);
        throw new Error(`Failed to update testimonial with ID ${id}.`);
      });
  }

  async remove(id: number): Promise<string> {
    return await this.testimonialsRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Testimonial with ID ${id} not found.`;
        }
        return `Testimonial with ID ${id} deleted successfully.`;
      })
      .catch((error) => {
        console.error('Error deleting testimonial:', error);
        throw new Error(`Failed to delete testimonial with ID ${id}.`);
      });
  }
}
