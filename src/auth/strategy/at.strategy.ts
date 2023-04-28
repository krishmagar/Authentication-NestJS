import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TOKENS } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: TOKENS.ACCESS_TOKEN_SECRET,
    });
  }

  validate(payload: any) {
    return payload;

    // req.user = payload
  }

  getFin() {
    console.log('hello');
  }
}
