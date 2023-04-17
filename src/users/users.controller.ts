import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }
}
