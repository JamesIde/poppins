import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/types/product-interface';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}
  product: Product;
  isLoading!: boolean;
  isError!: boolean;
  errorMsg!: string;

  // Image Slider Array
  imageObject: Array<Object> = [];
  ngOnInit(): void {
    this.isLoading = true;
    this.productService
      .getProduct(
        this.route.snapshot.params['id'],
        this.route.snapshot.params['slug']
      )
      .subscribe({
        next: (product) => {
          this.product = product;
          this.isLoading = false;
          console.log(this.product.productDescription[0]);
          this.imageObject = this.processImageArray(this.product);
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.errorMsg = error.error.message;
          console.log(error);
        },
      });
  }

  // Process image object array for slider
  processImageArray(product: Product) {
    return product.productImage.map((image) => {
      return {
        image: image,
        thumbImage: image,
        alt: product.productName,
        title: product.productSlug,
      };
    });
  }
}
