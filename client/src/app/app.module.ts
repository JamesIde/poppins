import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  // Import global components (header, footer, etc.)
  declarations: [HeaderComponent, AppComponent, FooterComponent],
  // Import our modules
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductsModule,
    AuthModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [], // Http Interceptors
  bootstrap: [AppComponent],
})
export class AppModule {}
