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
import { Product } from '../types/product-interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  productsArraySub$ = new BehaviorSubject<Product>(null);
  // TODO add type to this request when author/createdat review is fixed
  getProducts(category: string | null): Observable<Product> {
    return this.http
      .get<any>(`${environment.SERVER_DOMAIN}/products`, {
        params: {
          take: '10',
          skip: '0',
          category: category ? category : null,
        },
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
        tap((products) => {
          this.productsArraySub$.next(products);
        })
      );
  }

  getProduct(id: string, slug: string): Observable<Product> {
    return this.http
      .get<any>(`${environment.SERVER_DOMAIN}/products/${id}`)
      .pipe(
        // Map to product
        map((res) => {
          return {
            id: res.product.id,
            productName: res.product.productName,
            productSlug: res.product.productSlug,
            productDescription: res.product.productDescription,
            productPrice: res.product.productPrice,
            productImage: res.product.productImage,
            productCategory: res.product.productCategory,
            productBrand: res.product.productBrand,
            stockCount: res.product.stockCount,
            createdAt: res.createdAt,
            isStockAvailable: res.product.isStockAvailable,
            reviews: res.reviews,
            averageRating: res.averageRating,
            reviewCount: res.reviewCount,
          };
        })
      );
  }
}
