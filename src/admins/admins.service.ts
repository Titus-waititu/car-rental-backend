import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private readonly prismaService:PrismaService){}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async findAll(search?:string) {
    const res = await this.prismaService.admins.findMany()
    if(search){
      return `This action returns all students matching the search term: ${search}`;
    }
    return `This action returns all admins ${JSON.stringify(res)}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
