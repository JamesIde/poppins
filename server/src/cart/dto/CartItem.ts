import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CartItemDto {
  @IsNotEmpty()
  @IsNumberString()
  id: string;

  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsString()
  productSlug: string;

  @IsNotEmpty()
  @IsNumberString()
  productPrice: string;

  @IsNotEmpty()
  @IsString()
  productImage: string;
}
