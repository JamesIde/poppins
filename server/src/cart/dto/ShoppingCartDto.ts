import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CartItemDto } from './CartItemDto';

export class ShoppingCart {
  cartItems: ShoppingCartItem[];
  cartTotal: number;
}

export class ShoppingCartItem extends CartItemDto {
  quantity: number;
  totalPrice: number;
}

export enum CART_ACTION {
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
}

export class UpdateCartItem {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsString()
  productSlug: string;
  @IsNotEmpty()
  @IsNumber()
  productPrice: number;
  @IsNotEmpty()
  CART_ACTION: CART_ACTION;
}
