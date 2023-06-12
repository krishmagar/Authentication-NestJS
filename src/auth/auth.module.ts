import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthLocalStrategy } from './strategy/auth.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { TOKENS } from 'config';
import { AtStrategy, RtStrategy } from './strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: TOKENS.ACCESS_TOKEN_SECRET,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'jonatan42@ethereal.email',
          pass: 'KTHgFGJN4M9JsvgnNA',
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AuthLocalStrategy,
    AtStrategy,
    RtStrategy,
  ],
})
export class AuthModule {}
