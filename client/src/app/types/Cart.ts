export class CartItem {
  id: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productSlug: string;
}

export class CartItemMetadata extends CartItem {
  quantity: number;
  totalPrice: number;
}

export class ShoppingCart {
  cartItems: CartItemMetadata[];
  cartTotal: number;
}

export class CartResponse {
  message: string;
}
