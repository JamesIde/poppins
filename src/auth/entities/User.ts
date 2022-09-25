import {
  IsString,
  IsNotEmpty,
  MinLength,
  isNumberString,
  IsNumberString,
} from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Column({ select: false })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @Column({ default: 0 })
  @IsNumberString()
  tokenVersion: number;
}
