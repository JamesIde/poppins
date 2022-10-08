import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/CartItemDto';
import { Request, Response } from 'express';
import { UpdateCartItem } from './dto/ShoppingCartDto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(
    @Body() cartItem: CartItemDto,
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    return this.cartService.addToCart(cartItem, req, res);
  }

  @Get()
  getShoppingCart(@Req() req) {
    return this.cartService.getShoppingCart(req);
  }

  @Patch()
  async updateCartItem(
    @Body() updateCartItem: UpdateCartItem,
    @Req() req: Request,
    @Res({ passthrough: true }) res,
  ) {
    return this.cartService.updateCartItem(updateCartItem, req, res);
  }

  @Delete()
  remove(@Res({ passthrough: true }) res): boolean {
    return this.cartService.clearCart(res);
  }
}
