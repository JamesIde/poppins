import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Product } from './products/entities/Product';
import { JwtModule } from './jwt/jwt.module';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { User } from './auth/entities/User';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/Review';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      url: process.env.DATABASE_URI,
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
      entities: [Product, User, Review],
    }),
    ProductsModule,
    JwtModule,
    AuthModule,
    OrdersModule,
    ReviewsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
