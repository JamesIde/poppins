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
  DECREASE_ITEM_QUANTITY = 'DECREASE_ITEM_QUANTITY',
  REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART',
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
