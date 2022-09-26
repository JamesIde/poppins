import {
  IsString,
  IsNotEmpty,
  MinLength,
  isNumberString,
  IsNumberString,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @MinLength(4)
  password: string;

  @Column({ default: 0 })
  tokenVersion: number;
}
