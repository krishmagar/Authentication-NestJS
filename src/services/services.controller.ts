import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @UseGuards(AuthGuard('local'))
  findAll() {
    return this.servicesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.servicesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
  //   return this.servicesService.update(+id, updateServiceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.servicesService.remove(+id);
  // }
}
