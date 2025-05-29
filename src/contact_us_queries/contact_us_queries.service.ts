import { Injectable } from '@nestjs/common';
import { CreateContactUsQueryDto } from './dto/create-contact_us_query.dto';
import { UpdateContactUsQueryDto } from './dto/update-contact_us_query.dto';
import { ContactUsQuery } from './entities/contact_us_query.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactUsQueriesService {
  constructor(
    @InjectRepository(ContactUsQuery)
    private contactUsQueryDto: Repository<ContactUsQuery>,
  ) {}
  async create(createContactUsQueryDto: CreateContactUsQueryDto) {
    return await this.contactUsQueryDto.save(createContactUsQueryDto).then((contactUsQuery) => {
      return contactUsQuery;
    });
  }

  async findAll() {
    return await this.contactUsQueryDto.find().then((contactUsQueries) => {
      if (contactUsQueries.length === 0) {
        return 'No contact us queries found';
      }
      return contactUsQueries;
    }
    ).catch((error) => {  
      console.error('Error fetching contact us queries:', error);
      throw new Error('Failed to fetch contact us queries');
    }
    );
  }

  async findOne( query_id: number) {
    return await this.contactUsQueryDto.findOneBy({  query_id }).then((contactUsQuery) => {  
      if (!contactUsQuery) {
        return `Contact us query with ID ${ query_id} not found`;
      }
      return contactUsQuery;
    }
    ).catch((error) => {
      console.error('Error fetching contact us query:', error);
      throw new Error(`Failed to fetch contact us query with ID ${ query_id}`);
    }
    );
  }

  async update(id: number, updateContactUsQueryDto: UpdateContactUsQueryDto) {
    return await this.contactUsQueryDto.update(id, updateContactUsQueryDto).then((result) => {
      if (result.affected === 0) {
        return `Contact us query with ID ${id} not found`;
      }
      return `Contact us query with ID ${id} updated successfully`;
    }
    ).catch((error) => {
      console.error('Error updating contact us query:', error);
      throw new Error(`Failed to update contact us query with ID ${id}`);
    }
    );
  }

  async remove(id: number) {
    return await this.contactUsQueryDto.delete(id).then((result) => {
      if (result.affected === 0) {
        return `Contact us query with ID ${id} not found`;
      }
      return `Contact us query with ID ${id} deleted successfully`;
    }
    ).catch((error) => {
      console.error('Error deleting contact us query:', error);
      throw new Error(`Failed to delete contact us query with ID ${id}`);
    }
    );
  }
}
