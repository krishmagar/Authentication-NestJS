import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto, UserLoginDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto';
import { CreateUserDto } from 'src/users/dto/';
import { AtAuthGuard, LocalAuthGuard, RtAuthGuard } from './guards';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UsersService } from 'src/users/users.service';
import { Tokens } from './types';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
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

  @Post('forgot-password')
  @ApiOperation({ summary: 'Auth Forget Password' })
  @ApiResponse({
    status: 201,
    description: 'Password Reset Link Has Been Sent To Your Email.',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<Object> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password/:reset_token')
  @ApiOperation({ summary: 'Auth Reset Password' })
  @ApiResponse({
    status: 201,
    description: 'Password Reset Successfully.',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('reset_token', ParseIntPipe) reset_token: bigint,
  ): Promise<Object> {
    return await this.authService.resetPassword(
      reset_token,
      resetPasswordDto.newPassword,
    );
  }

  @Post('update-password')
  @ApiBearerAuth('jwt')
  @UseGuards(AtAuthGuard)
  @ApiOperation({ summary: 'Auth Update Password' })
  @ApiResponse({
    status: 201,
    description: 'Password Has Been Updated Successfully.',
  })
  async updatePassword(
    @CurrentUser() me,
    @Body() updatePassword: UpdatePasswordDto,
  ): Promise<Object> {
    return await this.authService.updatePassword(me, updatePassword);
  }

  @Post('refresh-token/:refresh_token')
  @ApiBearerAuth('jwt')
  @UseGuards(RtAuthGuard)
  @ApiOperation({ summary: 'Get New Access & Refresh Tokens' })
  @ApiResponse({
    status: 201,
    description: 'New Access & Refresh Tokens Sent Successfully',
  })
  async refreshToken(
    @CurrentUser() me,
    @Param('refresh_token') refresh_token: string,
  ): Promise<Tokens> {
    return await this.authService.refreshToken(me, refresh_token);
  }

  @Get('me')
  @ApiBearerAuth('jwt')
  @UseGuards(AtAuthGuard)
  @ApiOperation({ summary: 'Get My Details' })
  @ApiResponse({
    status: 201,
    description: 'My Details',
  })
  async getMyDetails(@CurrentUser() me) {
    return await this.userService.findOne(me['id']);
  }
}
