import { Injectable } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial) private testimonialsRepository: Repository<Testimonial>,
  ) {}
  async create(createTestimonialDto: CreateTestimonialDto) {
    return await this.testimonialsRepository.save(createTestimonialDto).then((testimonial) => {
      return testimonial
    }).catch((error) => { 
      console.error('Error creating testimonial:', error);
      throw new Error('Failed to create testimonial');
    }
    );
  }

  async findAll() {
    return await this.testimonialsRepository.find().then((testimonials) => {
      if (testimonials.length === 0) {
        return 'No testimonials found.';
      }
      return testimonials;
    }
    ).catch((error) => {
      console.error('Error retrieving testimonials:', error);
      throw new Error('Failed to retrieve testimonials.');
    }
  );
  }

  async findOne(id: number) {
    return await this.testimonialsRepository.findOne({ where: { testimonial_id: id } }).then((testimonial) => {
      if (!testimonial) {
        return `Testimonial with ID ${id} not found.`;
      }
      return testimonial;
    }
    ).catch((error) => {
      console.error('Error retrieving testimonial:', error);
      throw new Error(`Failed to retrieve testimonial with ID ${id}.`);
    }
  );
  }

  async update(id: number, updateTestimonialDto: UpdateTestimonialDto) {
    return await this.testimonialsRepository.update(id, updateTestimonialDto).then((result) => {
      if (result.affected === 0) {
        return `Testimonial with ID ${id} not found for update.`;
      }
      return `Testimonial with ID ${id} updated successfully.`;
    }
    ).catch((error) => {
      console.error('Error updating testimonial:', error);
      throw new Error(`Failed to update testimonial with ID ${id}.`);
    }
  );
  }

  async remove(id: number) {
    return await this.testimonialsRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        return `Testimonial with ID ${id} not found.`;
      }
      return `Testimonial with ID ${id} deleted successfully.`;
    }
    ).catch((error) => {
      console.error('Error deleting testimonial:', error);
      throw new Error(`Failed to delete testimonial with ID ${id}.`);
    }
    );
  }
}
