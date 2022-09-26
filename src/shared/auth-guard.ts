import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class jwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return isValidRequest(request);
  }
}

export const isValidRequest = (request) => {
  let token = request.headers.authorization?.split(' ')[1];

  if (!token || token === 'null') {
    throw new UnauthorizedException({
      message: 'No token provided',
    });
  }

  try {
    let decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    request.user = decodeToken;
  } catch (error) {
    throw new UnauthorizedException({
      message: 'Invalid token provided',
    });
  }

  return true;
};
