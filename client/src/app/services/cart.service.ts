import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CartItem,
  CartItemMetadata,
  CartResponse,
  ShoppingCart,
} from '../types/Cart';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}
  cartItemLengthSub$ = new BehaviorSubject<number>(0);
  cartItemSub$ = new BehaviorSubject<any>([]);
  addItemToCart(cartItem: CartItem): Observable<CartResponse> {
    return this.http
      .post<any>(environment.SERVER_DOMAIN + '/cart', cartItem, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
        map((res) => {
          return {
            message: res.message,
          };
        }),
        tap(() => {
          // Refretch cart items by calling service
          this.getCartItems().subscribe();
        })
      );
  }

  getCartItems(): Observable<ShoppingCart> {
    return this.http
      .get<any>(environment.SERVER_DOMAIN + '/cart', {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
        tap((res) => {
          console.log('TAP RESPONSE', res);
          this.cartItemSub$.next(res);
        })
      );
  }

  removeCartItem(item: CartItemMetadata): Observable<CartResponse> {
    const removeItem = {
      ...item,
      CART_ACTION: 'REMOVE_ITEM_FROM_CART',
    };

    return this.http
      .patch<any>(environment.SERVER_DOMAIN + '/cart', removeItem, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
        map((res) => {
          return {
            message: res.message,
          };
        }),
        tap(() => {
          this.getCartItems().subscribe();
        })
      );
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(environment.SERVER_DOMAIN + '/cart').pipe(
      tap(() => {
        this.getCartItems().subscribe();
      })
    );
  }
}
