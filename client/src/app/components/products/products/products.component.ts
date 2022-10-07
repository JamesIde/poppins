import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(private productService: ProductService) {}
  // TODO add product type (see other notes)
  productSubscription: Subscription;
  products: any = [];
  isLoading!: boolean;
  isError = false;
  errorMsg!: string;

  isRadioChecked: boolean;

  // Component initialization
  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.productSubscription =
        this.productService.productsArraySub$.subscribe((products) => {
          console.log('products', products);
          this.products = products;
          this.isLoading = false;
          this.isRadioChecked = false;
        });
    }, 1000);
    // Prevents radio filter box on reload
  }

  handleCategoryFilter(category: string): void {
    this.isRadioChecked = true;
    this.isLoading = true;
    this.productService.getProducts(category).subscribe();
  }
}
