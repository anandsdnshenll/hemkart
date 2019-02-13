import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientModule } from '@angular/common/http';
import { AppModule } from '../app.module';
import { SharedModule, HeaderComponent,FooterComponent } from '../shared';

@NgModule({
  declarations: [ProductComponent,HeaderComponent,FooterComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    Ng4LoadingSpinnerModule,
    ReactiveFormsModule,
    ProductRoutingModule,
  ]
})
export class ProductModule { }
