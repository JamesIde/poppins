import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CartItemMetadata, ShoppingCart } from 'src/app/types/Cart';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // Set up cart to be empty array of cart
  cart!: ShoppingCart;
  cartSub$: Subscription;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string;
  ngOnInit(): void {
    this.isLoading = true;
    this.cartSub$ = this.cartService.cartItemSub$.subscribe((cart) => {
      this.isLoading = false;
      this.cart = cart;
      console.log('CART COMPONENT STATE', cart);
    });
  }
  clearCart() {
    this.cartService.clearCart().subscribe();
    this.router.navigate(['/']);
  }

  removeCartItem(item: CartItemMetadata) {
    this.isLoading = true;
    this.cartService.removeCartItem(item).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success(
          `${item.productName} removed from cart!`,
          'Success!',
          {
            positionClass: 'toast-top-center',
          }
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.cartSub$.unsubscribe();
  }
}
