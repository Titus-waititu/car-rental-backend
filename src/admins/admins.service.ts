import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}
  // constructor(private readonly prismaService:PrismaService){}

  async create(createAdminDto: CreateAdminDto) {
    return await this.adminRepository
      .save(createAdminDto)
      .then((admin) => {
        return admin;
      })
      .catch((error) => {
        console.error('Error creating Admin:', error);
        throw new Error('Failed to create Admin');
      });
  }

  async findAll(email?: string) {
    if (email) {
      return await this.adminRepository.find({
        where: {
          email: email,
        },
      });
    }
    return this.adminRepository.find();
  }

  async findOne(admin_id: number): Promise<Admin | string> {
    return await this.adminRepository
      .findOneBy({ admin_id })
      .then((admin) => {
        if (!admin) {
          return `No admin found with id ${admin_id}`;
        }
        return admin;
      })
      .catch((error) => {
        console.error('Error finding admin:', error);
        throw new Error(`Failed to find admin with id ${admin_id}`);
      });
  }

  async update(
    admin_id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin | string> {
    await this.adminRepository.update(admin_id, updateAdminDto);

    return await this.findOne(admin_id);
  }

  async remove(id: number): Promise<string> {
    return await this.adminRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `No admin found with id ${id}`;
        }
        return `Admin with id ${id} has been removed`;
      })
      .catch((error) => {
        console.error('Error removing admin:', error);
        throw new Error(`Failed to remove admin with id ${id}`);
      });
  }
}
