import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UserLoginDto } from './dto/login.dto';
import { UserSignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('signup')
  signup(@Body() userSignUpDto: UserSignUpDto) {
    return this.authService.signup(userSignUpDto);
  }
}
