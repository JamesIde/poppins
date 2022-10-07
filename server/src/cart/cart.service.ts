import { Injectable, Req, Res } from '@nestjs/common';
import { CartItemDto } from './dto/CartItem';
import { Request, Response } from 'express';
import { CartItemSuccess } from './dto/CartItemSuccess';
@Injectable()
export class CartService {
  create(addCartItem: CartItemDto, @Req() req: Request, @Res() res): any {
    // if (!req.cookies.userCart) {
    //   console.log('NO COOKIE FOUND');
    //   // We assume a new cart will be created
    //   console.log('here', addCartItem);
    //   let cartArray = [];
    //   cartArray.push(addCartItem);

    //   res.cookie('userCart', JSON.stringify(cartArray), {
    //     httpOnly: true,
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    //   });
    //   console.log('COOKIE FOUND');
    //   return {
    //     message: `${addCartItem.productName} added to cart`,
    //   };
    // }

    return {
      data: {
        addCartItem,
      },
    };
    // message: `${addCartItem.productName} added to cart`,
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
