import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './layout/home/home.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { CoreModule } from './core';
import { LandingComponent } from './layout/landing/landing.component';
import { ProductModule } from './product/product.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderService } from './header.service';
import { LoginComponent } from './layout/login/login.component';
import { MatProgressSpinnerModule, MatRadioModule, MatSliderModule } from '@angular/material';
import { GrdFilterPipe } from './shared/pipe/grd-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    LoginComponent,
    GrdFilterPipe,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AppRoutingModule,
    ProductModule,
    MatProgressSpinnerModule, MatRadioModule, MatSliderModule,

  ],
  providers: [HeaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
