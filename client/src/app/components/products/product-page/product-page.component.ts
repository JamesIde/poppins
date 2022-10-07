import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { Product, Review } from 'src/app/types/product-interface';

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

  // Review Form
  reviewForm!: FormGroup;

  // Image Slider Array
  imageObject: Array<Object> = [];
  // Queryable id
  id: string = this.route.snapshot.params['id'];
  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getProduct(this.id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        console.log(this.product);
        this.imageObject = this.processImageArray(this.product);
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.errorMsg = error.error.message;
        console.log(error);
      },
    });
    // Initialise form
    this.reviewForm = new FormGroup({
      rating: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      city: new FormControl('', Validators.required),
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
