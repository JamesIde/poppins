import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.productService.getProducts(null).subscribe();
  }
}
