import { Injectable } from '@nestjs/common';
import { CreateContactUsQueryDto } from './dto/create-contact_us_query.dto';
import { UpdateContactUsQueryDto } from './dto/update-contact_us_query.dto';
import { ContactUsQuery, QueryStatus } from './entities/contact_us_query.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ContactUsQueriesService {
  constructor(
    @InjectRepository(ContactUsQuery) private contactUsQueryDto: Repository<ContactUsQuery>,
    @InjectRepository(User) private userQueryDto: Repository<User>,
    @InjectRepository(GuestUser) private guestUserQueryDto: Repository<GuestUser>,
  ) {}
  async create(createContactUsQueryDto: CreateContactUsQueryDto): Promise<string> {
    const user = await this.userQueryDto.findOne({
      where: { user_id: createContactUsQueryDto.userId },
    });
    const guest = await this.guestUserQueryDto.findOne({
      where: { guest_id: createContactUsQueryDto.guestId },
    });
    const { query_message, created_at, status } = createContactUsQueryDto;
    return await this.contactUsQueryDto
      .save({
        query_message,
        created_at,
        status: status || QueryStatus.pending, // Use enum value for default
        user: user || undefined,
        guest: guest || undefined,
      })
      .then((contactUsQuery: ContactUsQuery) => {
        return `Contact us query with ID ${contactUsQuery.query_id} created successfully`;
      })
      .catch((error) => {
        console.error('Error creating contact us query:', error);
        throw new Error('Failed to create contact us query');
      });
  }

  async findAll(): Promise<ContactUsQuery[] | string> {
    return await this.contactUsQueryDto
      .find({
        order: {
          query_id: 'ASC',
        },
        relations: {
          user: true,
        },
      })
      .then((contactUsQueries) => {
        if (contactUsQueries.length === 0) {
          return 'No contact us queries found';
        }
        return contactUsQueries;
      })
      .catch((error) => {
        console.error('Error fetching contact us queries:', error);
        throw new Error('Failed to fetch contact us queries');
      });
  }

  async findOne(query_id: number): Promise<ContactUsQuery | string> {
    return await this.contactUsQueryDto
      .findOne({
        order: {
          query_id: 'ASC',
        },
        where: { query_id },
        relations: {
          user: true,
          guest: true,
        },
      })
      .then((contactUsQuery) => {
        if (!contactUsQuery) {
          return `Contact us query with ID ${query_id} not found`;
        }
        return contactUsQuery;
      })
      .catch((error) => {
        console.error('Error fetching contact us query:', error);
        throw new Error(`Failed to fetch contact us query with ID ${query_id}`);
      });
  }

  async update(
    id: number,
    updateContactUsQueryDto: UpdateContactUsQueryDto,
  ): Promise<string> {
    return await this.contactUsQueryDto
      .update(id, updateContactUsQueryDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Contact us query with ID ${id} not found`;
        }
        return `Contact us query with ID ${id} updated successfully`;
      })
      .catch((error) => {
        console.error('Error updating contact us query:', error);
        throw new Error(`Failed to update contact us query with ID ${id}`);
      });
  }

  async remove(id: number): Promise<string> {
    return await this.contactUsQueryDto
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Contact us query with ID ${id} not found`;
        }
        return `Contact us query with ID ${id} deleted successfully`;
      })
      .catch((error) => {
        console.error('Error deleting contact us query:', error);
        throw new Error(`Failed to delete contact us query with ID ${id}`);
      });
  }
}
