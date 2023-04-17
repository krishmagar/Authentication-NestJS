import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
