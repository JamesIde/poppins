import { Review } from 'src/reviews/entities/Review';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
