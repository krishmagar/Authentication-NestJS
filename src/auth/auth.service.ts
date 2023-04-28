import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserLoginDto, UpdatePasswordDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.type';
import { TOKENS } from 'config';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import * as argon from 'argon2';
import { CreateUserDto } from '../users/dto';
import { User } from '@prisma/client';
import { sendResetEmail } from './email/reset-password';

@Injectable()
export class AuthService {
  verifyToken(authToken: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private userService: UsersService,
  ) {}

  // Generates Access & Refresh Token
  async generateTokens(payload: any): Promise<Tokens> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: TOKENS.ACCESS_TOKEN_SECRET,
      expiresIn: TOKENS.ACCESS_EXPIRES_IN,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: TOKENS.REFRESH_TOKEN_SECRET,
      expiresIn: TOKENS.REFRESH_EXPIRES_IN,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  //prashant
  async validateUser(username: string, password: string): Promise<User> {
    // Checking If User Exists
    const user = await this.prisma.user.findUnique({ where: { username } });

    // Verifying The Password
    const hashPassword = await argon.verify(user.password, password);

    if (!user || !hashPassword)
      throw new HttpException('Invalid Credentials', HttpStatus.CONFLICT);

    return user;
  }

  async signin(signInDto: UserLoginDto): Promise<Object> {
    // Checking If User Is Valid Or Not
    const user = await this.validateUser(
      signInDto.username,
      signInDto.password,
    );

    // Generating Access & Refresh Tokens
    const { id, email } = user;

    const tokens = await this.generateTokens({ id, email });

    // Return Tokens
    return {
      message: 'User Logged In Successfully',
      ...tokens,
    };
  }

  async signup(signUpDto: CreateUserDto): Promise<Object> {
    // Creates A New User
    const { id, email, ...newUser } = await this.userService.create(signUpDto);

    // Generates Access & Refresh Tokens
    const tokens = await this.generateTokens({ id, email });

    // Returns The Token
    return {
      message: 'User Signed Up Successfully !!!',
      ...tokens,
    };
  }

  async forgetPassword(email: string): Promise<object> {
    const user = this.userService.findOneByEmail(email);

    if (!user) throw new BadRequestException('Invalid Email');

    // Insert Email, Password Reset Token & Password Reset Token Expiration Date
    // in the Reset Password Database Model
    const pass_reset_token =
      Math.floor(Math.random() * 9000000000) + 1000000000;
    const pass_reset_token_expires = Date.now() + 10 * 60 * 1000;

    const newResetPassword = await this.prisma.resetPassword.upsert({
      where: {
        email,
      },
      create: {
        email,
        pass_reset_token,
        pass_reset_token_expires,
      },
      update: {
        pass_reset_token,
        pass_reset_token_expires,
      },
    });

    // Sending Email with Reset Link
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'NepTechPal <no-reply@krishmagar.com>',
        subject: 'Reset Password Link',
        text: 'Click On The Button Below To Reset Password',
        html: `${sendResetEmail(newResetPassword.pass_reset_token)}`,
      });

      return {
        success: true,
        message: 'Reset Password Link Has Been Sent To Your Email',
      };
    } catch (e) {
      return {
        success: false,
        message: 'Something Went Wrong Sending Email',
      };
    }
  }

  async resetPassword(
    reset_token: bigint,
    newPassword: string,
  ): Promise<Object> {
    // Checking If Valid Token Exists & If the Token Has Not Expired
    const user = await this.prisma.resetPassword.findFirst({
      where: {
        pass_reset_token: reset_token,
        pass_reset_token_expires: { gt: Date.now() },
      },
    });

    if (!user) throw new HttpException('Reset Token Has Expired', 498);

    // If User Exists Then Reset Password
    const hashedPassword = await argon.hash(newPassword);

    const userWithNewPass = await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Removing the Field from "Reset Password Database"
    await this.prisma.resetPassword.delete({
      where: {
        email: user.email,
      },
    });

    // Logging In User & Sending Access Token And Refresh Token
    const { id, email } = userWithNewPass;

    const tokens = await this.generateTokens({ id, email });

    return {
      message: 'Password Reset Successfully !!!',
      ...tokens,
    };
  }

  async updatePassword(
    me: Object,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Object> {
    // Getting User By Email
    const user = await this.userService.findOneByEmail(me['email']);

    // Checking If Provided Current Password Is Correct Or Not
    if (!(await argon.verify(user.password, updatePasswordDto.password)))
      throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);

    // Changing Password
    const hashedPassword = await argon.hash(updatePasswordDto.newPassword);

    const { id, email, ...updatedUser } = await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Sending Access Token &  Refresh Token Again
    const tokens = await this.generateTokens({ id, email });

    return {
      message: 'Password Updated Successfully !!!',
      ...tokens,
    };
  }

  async refreshToken(me: Object) {
    try {
      // Generating & Sending Access & Refresh Tokens
      const id = me['id'];
      const email = me['email'];

      const tokens = await this.generateTokens({ id, email });

      return {
        message: 'New Access & Refresh Tokens',
        ...tokens,
      };
    } catch (e) {
      return {
        message: 'Something Went Wrong Generating New Access & Refresh Tokens',
      };
    }
  }
}
