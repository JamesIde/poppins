import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AuthModule } from './components/auth/auth.module';
import { HeaderComponent } from './components/auth/header/header.component';
import { ProductsModule } from './components/products/products.module';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SharedModule } from './components/shared/shared.module';
import { CartComponent } from './components/cart/cart.component';
import { CartModule } from './components/cart/cart.module';
import { AuthInterceptor } from './components/auth/auth-interceptor';
import { AuthService } from './services/auth.service';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  // Import global components (header, footer, etc.)
  declarations: [HeaderComponent, AppComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductsModule,
    AuthModule,
    CartModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ], // Http Interceptors
  bootstrap: [AppComponent],
})
export class AppModule {}
