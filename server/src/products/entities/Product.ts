import { Review } from 'src/reviews/entities/Review';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  productSlug: string;

  @Column({ type: 'text', array: true })
  productDescription: string[];

  @Column()
  productPrice: number;

  @Column({ type: 'text', array: true })
  productImage: string[];

  @Column()
  productCategory: string;

  @Column()
  productBrand: string;

  @Column()
  stockCount: number;

  @Column({ default: true })
  isStockAvailable: boolean;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
