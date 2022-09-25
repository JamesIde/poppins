import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Observable } from 'rxjs';

@Injectable()
export class LicoriceGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request.body);
    return isLicorice(request);
  }
}

export const isLicorice = (request) => {
  const { name } = request.body;
  if (!name) {
    throw new BadRequestException(`Product name not found`);
  }
  // console.log(name);
  if (name.includes('berry') || name.includes('berry')) {
    request.title = 'pog';
    return true;
  }
  return false;
};

/*
export class LicoriceGlobalGuard extends AuthGuard (RENAME LICORICE GUARD)
Then in main.ts

*/
