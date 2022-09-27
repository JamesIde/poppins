import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  productName: string;

  @IsNotEmpty()
  @IsArray()
  productDescription: string[];

  @IsNotEmpty()
  @IsNumberString()
  productPrice: number;

  @IsNotEmpty()
  @IsArray()
  productImage: string[];

  @IsNotEmpty()
  @IsString()
  productCategory: string;

  @IsNotEmpty()
  @IsString()
  productBrand: string;

  @IsNotEmpty()
  @IsNumberString()
  stockCount: number;
}
