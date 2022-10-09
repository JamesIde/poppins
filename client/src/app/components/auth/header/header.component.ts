import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ShoppingCart } from 'src/app/types/Cart';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}
  userAuthSub!: Subscription;
  cartItemSub!: Subscription;
  loggedUser!: User;
  cartItemCount: number;
  isAuth: boolean;
  ngOnInit(): void {
    this.isAuth = false;
    this.userAuthSub = this.authService.loggedUser.subscribe((user) => {
      this.loggedUser = user ? user : null;
      this.isAuth = true;
    });

    this.cartItemSub = this.cartService.cartItemSub$.subscribe({
      next: (cart) => {
        console.log('HEADER CART', cart);
        this.handleCartResponse(cart);
      },
    });
  }

  ngOnDestroy(): void {
    this.userAuthSub.unsubscribe();
  }

  handleLogout() {
    this.authService.handleLogout();
    this.router.navigate(['/']);
  }

  handleCartResponse(cart: ShoppingCart): void {
    if (cart && cart.cartItems !== undefined) {
      this.cartItemCount = cart.cartItems.length;
    } else {
      this.cartItemCount = 0;
    }
  }
}
