import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/auth/entities/User';
@Injectable()
export class JwtService {
  // TODO type here
  generateAccessToken(user: User): string {
    return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
  }
}
