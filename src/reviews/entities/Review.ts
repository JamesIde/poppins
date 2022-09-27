import { IsNotEmpty, IsNumberString } from 'class-validator';
import { User } from 'src/auth/entities/User';
import { Product } from 'src/products/entities/Product';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}
