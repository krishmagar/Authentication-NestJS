import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.guard';
import { UpdatePasswordDto } from './dto';
import { CreateUserDto } from 'src/users/dto/';
import { AtAuthGuard, RtAuthGuard } from './guards';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Auth login' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully signed in.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async signin(@Body() signInDto: UserLoginDto): Promise<Object> {
    return await this.authService.signin(signInDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Auth Sign Up' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully signed up.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async signup(@Body() signUpDto: CreateUserDto): Promise<Object> {
    return await this.authService.signup(signUpDto);
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Auth Forget Password' })
  @ApiResponse({
    status: 201,
    description: 'Password Reset Link Has Been Sent To Your Email.',
  })
  async forgetPassword(@Body() body: { email: string }): Promise<Object> {
    return await this.authService.forgetPassword(body.email);
  }

  @Post('reset-password/:reset_token')
  @ApiOperation({ summary: 'Auth Reset Password' })
  @ApiResponse({
    status: 201,
    description: 'Password Reset Successfully.',
  })
  async resetPassword(
    @Param('reset_token', ParseIntPipe) reset_token: bigint,
    @Body() body: { newPassword: string },
  ): Promise<Object> {
    const { newPassword } = body;

    return await this.authService.resetPassword(reset_token, newPassword);
  }

  @Post('update-password')
  @UseGuards(AtAuthGuard)
  @ApiOperation({ summary: 'Auth Update Password' })
  @ApiResponse({
    status: 201,
    description: 'Password Has Been Updated Successfully.',
  })
  async updatePassword(
    @Req() req: Request,
    @Body() updatePassword: UpdatePasswordDto,
  ): Promise<Object> {
    return await this.authService.updatePassword(req.user, updatePassword);
  }

  @Post('refresh-token')
  @UseGuards(RtAuthGuard)
  @ApiOperation({ summary: 'Get New Access & Refresh Tokens' })
  @ApiResponse({
    status: 201,
    description: 'New Access & Refresh Tokens Sent Successfully',
  })
  async refreshToken(@Req() req: Request): Promise<Object> {
    return await this.authService.refreshToken(req.user);
  }
}
