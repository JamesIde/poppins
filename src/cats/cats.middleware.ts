import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// @Injectable()
// // This is an injectable class-based middleware
// export class CatMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     console.log('I love cats - from middleware');
//     next();
//   }
// }

// This is a functional middleware
export function CatMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.body);
  next();
}
