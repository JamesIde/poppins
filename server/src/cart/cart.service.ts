import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import { CartItemDto } from './dto/CartItemDto';
import { Request, response, Response } from 'express';
import { ProductService } from 'src/products/products.service';
import { SingleProduct } from 'src/products/dto/getProductDto';
import {
  CART_ACTION,
  ShoppingCart,
  ShoppingCartItem,
  UpdateCartItem,
} from './dto/ShoppingCartDto';

@Injectable()
export class CartService {
  constructor(private productService: ProductService) {}
  async addToCart(cartItem: CartItemDto, @Req() req, res): Promise<any> {
    if (!req.cookies.userCart) {
      // No cookies found, assume a new checkout session
      if (cartItem) {
        // Validate the payload before adding to cart
        if (await this.validateItemPayload(cartItem)) {
          const newItem: ShoppingCartItem = {
            ...cartItem,
            quantity: 1,
            totalPrice: cartItem.productPrice,
          };
          const shoppingCart = new ShoppingCart();
          shoppingCart.cartItems = [];
          shoppingCart.cartItems.push(newItem);
          shoppingCart.cartTotal = newItem.totalPrice;

          this.sendCartCookie(shoppingCart, res);
          console.log(`NEW CART INITIATED - ${cartItem.productName} ADDED`);
          return {
            message: `${cartItem.productName} added to cart`,
          };
        } else {
          throw new HttpException(
            {
              message: 'Item not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        // Wont be reached due to class validator
        throw new HttpException(
          {
            message: 'No cart item found in request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      // Cookie found - assuming existing checkout session
      let cart: ShoppingCart = JSON.parse(req.cookies.userCart);
      if (await this.validateItemPayload(cartItem)) {
        // Validate each item in cookie to prevent malicious data
        await this.validateParsedCookie(cart);

        // Find the item index in the cart
        let itemIdx = this.findItemIndex(cart, cartItem);
        if (itemIdx !== -1) {
          // Update price, quantity and total cost
          return this.updateItemQuantity(cart, itemIdx, res, cartItem);
        } else {
          // No item found in array of items, means new item added to cart
          const addItem = {
            ...cartItem,
            quantity: 1,
            totalPrice: cartItem.productPrice,
          };
          // Spread across the existing cart items
          cart.cartItems = [...cart.cartItems, addItem];
          cart.cartTotal = this.calculateCartTotal(cart);
          this.sendCartCookie(cart, res);
          console.log(
            `NEW ITEM ADDED TO EXISTING CART - ${cartItem.productName}`,
          );
          return {
            message: `${cartItem.productName} added to cart`,
          };
        }
      } else {
        throw new HttpException(
          {
            message: 'Item not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  } // End of function

  getShoppingCart(@Req() req): ShoppingCart | [] {
    if (!req.cookies.userCart) {
      return [];
    }
    const cart: ShoppingCart = JSON.parse(req.cookies.userCart);
    return cart;
  }

  async updateCartItem(
    updateCartItem: UpdateCartItem,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.cookies.userCart) {
      throw new HttpException(
        {
          message: 'Your cart appears to be empty.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updateCartItem.CART_ACTION === CART_ACTION.ADD_ITEM) {
      let cart: ShoppingCart = JSON.parse(req.cookies.userCart);
      let itemIdx: number;
      await this.validateParsedCookie(cart);
      if (await this.validateItemPayload(updateCartItem)) {
        itemIdx = this.findItemIndex(cart, updateCartItem);

        if (itemIdx !== -1) {
          return this.updateItemQuantity(cart, itemIdx, res, updateCartItem);
        } else {
          throw new HttpException(
            {
              message: 'Item not found in cart',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } else if (
      updateCartItem.CART_ACTION === CART_ACTION.DECREASE_ITEM_QUANTITY
    ) {
      let cart: ShoppingCart = JSON.parse(req.cookies.userCart);
      let itemIdx: number;
      await this.validateParsedCookie(cart);
      if (await this.validateItemPayload(updateCartItem)) {
        itemIdx = this.findItemIndex(cart, updateCartItem);

        // Decrement quantity
        if (itemIdx !== -1) {
          return this.decrementItemQuantity(cart, itemIdx, res, updateCartItem);
        }
      }
    } else if (
      updateCartItem.CART_ACTION === CART_ACTION.REMOVE_ITEM_FROM_CART
    ) {
      let cart: ShoppingCart = JSON.parse(req.cookies.userCart);
      let itemIdx: number;
      await this.validateParsedCookie(cart);
      if (await this.validateItemPayload(updateCartItem)) {
        itemIdx = this.findItemIndex(cart, updateCartItem);

        // Decrement quantity
        if (itemIdx !== -1) {
          return this.removeItemFromCart(cart, itemIdx, res, updateCartItem);
        }
      }
    } else {
      throw new HttpException(
        {
          message: 'Invalid Cart Action',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  clearCart(@Res() res: Response): boolean {
    res.cookie('userCart', '', { maxAge: 0 });
    return true;
  }

  /**
   * A private function to update the quantity of an item in the cart
   * It calls the @sendCartCookie function to update the cookie and the @calculateCardTotal function to get the cart total
   */
  private updateItemQuantity(
    cart: ShoppingCart,
    itemIdx: number,
    res: any,
    cartItem: CartItemDto | UpdateCartItem,
  ) {
    cart.cartItems[itemIdx].quantity += 1;
    cart.cartItems[itemIdx].totalPrice =
      cart.cartItems[itemIdx].quantity * cart.cartItems[itemIdx].productPrice;
    cart.cartTotal = this.calculateCartTotal(cart);

    this.sendCartCookie(cart, res);
    console.log(`ITEM QUANTITY INCREMENTED - ${cartItem.productName}`);
    return {
      message: `${cartItem.productName} added to cart`,
    };
  }

  /**
   * A private function to decrememnt the quantity of an item in the cart
   * It calls the @sendCartCookie function to update the cookie and the @calculateCardTotal function to get the cart total
   */
  private decrementItemQuantity(
    cart: ShoppingCart,
    itemIdx: number,
    res: any,
    cartItem: CartItemDto | UpdateCartItem,
  ) {
    cart.cartItems[itemIdx].quantity -= 1;

    // If quantity reaches zero, remove from cart array
    if (cart.cartItems[itemIdx].quantity === 0) {
      cart.cartItems.splice(itemIdx, 1);
      this.sendCartCookie(cart, res);
      console.log(`ITEM REMOVED FROM CART - ${cartItem.productName}`);
      return {
        message: `${cartItem.productName} removed from cart`,
      };
    }

    cart.cartItems[itemIdx].totalPrice =
      cart.cartItems[itemIdx].quantity * cart.cartItems[itemIdx].productPrice;
    cart.cartTotal = this.calculateCartTotal(cart);

    this.sendCartCookie(cart, res);
    console.log(`ITEM QUANTITY DECREMENTED - ${cartItem.productName}`);
    return {
      message: `${cartItem.productName} quantity decremented`,
    };
  }
  /**
   *  A private function to remove an item from the cart
   * It calls the @sendCartCookie function to update the cookie and the @calculateCardTotal function to get the cart total
   *
   */
  private removeItemFromCart(
    cart: ShoppingCart,
    itemIdx: number,
    res: any,
    cartItem: CartItemDto | UpdateCartItem,
  ) {
    cart.cartItems.splice(itemIdx, 1);
    cart.cartTotal = this.calculateCartTotal(cart);
    this.sendCartCookie(cart, res);
    console.log(`ITEM REMOVED FROM CART - ${cartItem.productName}`);
    return {
      message: `${cartItem.productName} removed from cart`,
    };
  }

  /**
   * A private method for finding the index of an item in the cart
   */
  private findItemIndex(
    cart: ShoppingCart,
    cartItem: CartItemDto | UpdateCartItem,
  ) {
    return cart.cartItems.findIndex((item) => item.id === cartItem.id);
  }

  /**
   * A private method for parsing the userCart cookie to check for unknown data
   * Acts as a security measure to prevent malicious data from being injected to the cart
   * It relies on a publically available method @findSingleProduct to query the database for the product
   */
  private async validateParsedCookie(
    cart: ShoppingCart,
  ): Promise<any | boolean> {
    for (let i = 0; i < cart.cartItems.length; i++) {
      let isValid: SingleProduct;
      try {
        isValid = await this.productService.findSingleProduct(
          cart.cartItems[i].id,
        );
      } catch (error) {
        throw new HttpException(
          {
            message: error.message || error || response['message'],
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  /**
   * A private method for validating the item payload on 'add to cart'.
   *
   */
  private async validateItemPayload(
    cartItem: CartItemDto | UpdateCartItem,
  ): Promise<boolean> {
    let isValid: SingleProduct;
    try {
      isValid = await this.productService.findSingleProduct(cartItem.id);
      if (
        isValid.product.productName !== cartItem.productName ||
        isValid.product.productPrice !== cartItem.productPrice ||
        isValid.product.productSlug !== cartItem.productSlug
      ) {
        throw new HttpException(
          {
            message: 'Invalid cart item detected',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return true;
    } catch (error) {
      console.log('ERROR -->', error);
      throw new HttpException(
        {
          message: error.message || error || response['message'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
   *  A private method for calculating the total cost of the shopping cart
   *
   */
  private calculateCartTotal(cart: ShoppingCart): number {
    let total = 0;
    cart.cartItems.forEach((item) => {
      total += item.totalPrice;
    });
    return total;
  }

  /**
   *  A private method for sending the cart cookie to the client
   *
   */
  private async sendCartCookie(
    cartItem: ShoppingCart,
    res?: any,
  ): Promise<any> {
    // Send back the cookie
    res.cookie('userCart', JSON.stringify(cartItem), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
}
