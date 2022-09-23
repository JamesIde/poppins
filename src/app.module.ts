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
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product';
@Module({
  imports: [
    CatsModule,
    ChocolateModule,
    ProductsModule,
    // TODO Move these to env vars
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'tudorgres',
      entities: [Product],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CatMiddleware).forRoutes({
      path: 'products',
      method: RequestMethod.POST,
    });
  }
}
