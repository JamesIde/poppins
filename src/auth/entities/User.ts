import {
  IsString,
  IsNotEmpty,
  MinLength,
  isNumberString,
  IsNumberString,
} from 'class-validator';
import { Product } from 'src/products/entities/Product';
import { Review } from 'src/reviews/entities/Review';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  tokenVersion: number;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
