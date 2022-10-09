import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/types/Product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  product: Product;
  isLoading!: boolean;
  isError!: boolean;
  errorMsg!: string;

  isAddedToCart: boolean;

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
        console.log(this.imageObject);
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
        alt: '',
      };
    });
  }

  handleItemClick(product: Product) {
    this.isAddedToCart = true;
    // Map to acceptable format
    const addProduct = {
      id: product.id,
      productName: product.productName,
      productPrice: product.productPrice,
      productImage: product.productImage[0],
      productSlug: product.productSlug,
    };

    this.cartService.addItemToCart(addProduct).subscribe({
      next: (response) => {
        console.log(response);
        this.isAddedToCart = false;
        this.toastr.success(
          `${addProduct.productName} added to cart`,
          'Success!',
          {
            positionClass: 'toast-top-center',
          }
        );
      },
      error: (error) => {
        this.isAddedToCart = false;
        console.log(error);
        this.isError = true;
        this.errorMsg = error.error.message || error.message;
      },
    });
  }
}
