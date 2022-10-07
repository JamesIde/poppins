import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from '../shared/shared.module';
import { ProductPageComponent } from './product-page/product-page.component';
import { RouterModule } from '@angular/router';
import { ProductRoutingModule } from './product-routing.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductsComponent, ProductPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ProductRoutingModule,
    NgImageSliderModule,
    ReactiveFormsModule,
  ],
  exports: [ProductsComponent],
})
export class ProductsModule {}
