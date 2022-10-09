import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from '../shared/shared.module';
import { ProductPageComponent } from './product-page/product-page.component';
import { RouterModule } from '@angular/router';
import { ProductRoutingModule } from './product-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent } from './product-card/product-card.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ProductsComponent, ProductPageComponent, ProductCardComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    NgImageSliderModule,
    BrowserAnimationsModule,
  ],
  exports: [ProductsComponent],
})
export class ProductsModule {}
