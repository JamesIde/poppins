import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CatMiddleware } from './cats/cats.middleware';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ChocolateModule } from './chocolate/chocolate.module';

@Module({
  imports: [CatsModule, ChocolateModule],
  controllers: [],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CatMiddleware).forRoutes({
      path: 'cats',
      method: RequestMethod.POST,
    });
  }
}
