import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { Product } from './entities/Product';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ReviewsModule],
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductsModule {}
