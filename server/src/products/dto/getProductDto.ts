import { Review } from 'src/reviews/entities/Review';
import { Product } from '../entities/Product';

export class SingleProduct {
  product: Product;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}
