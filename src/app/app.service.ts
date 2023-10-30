import { Injectable, UseGuards } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { message: 'Hello!' };
  }
}
