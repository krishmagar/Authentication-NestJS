import { Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/login.dto';
import { UserSignUpDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async login(userLoginDto: UserLoginDto) {
    const { username, password } = userLoginDto;

    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!user) return 'User Not Found';

    if (password === user.password) {
      return 'Logged In!!!';
    } else {
      return 'Wrong Password!!!';
    }
  }

  async signup(userSignUpDto: UserSignUpDto) {
    const { username } = userSignUpDto;

    const user = await this.prisma.user.findFirst({ where: { username } });
    if (user) return 'User Already Exists';

    return this.prisma.user.create({ data: userSignUpDto });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
