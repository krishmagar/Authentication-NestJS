import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      return await this.prisma.service.create({ data: createServiceDto });
    } catch (e) {
      console.log(e.message);
    }
  }

  async findAll() {
    return await this.prisma.service.findMany();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} service`;
  // }

  // update(id: number, updateServiceDto: UpdateServiceDto) {
  //   return `This action updates a #${id} service`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} service`;
  // }
}
