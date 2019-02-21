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
import { HttpClientModule } from '@angular/common/http';
import { HeaderService } from './header.service';
import { LoginComponent } from './layout/login/login.component';
import { MatProgressSpinnerModule, MatRadioModule, MatSliderModule } from '@angular/material';
import { GrdFilterPipe } from './shared/pipe/grd-filter.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ProductComponent } from './layout/product/product.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    LoginComponent,
    GrdFilterPipe,
    ProductComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AppRoutingModule,
    NgxSpinnerModule,
    MatProgressSpinnerModule, MatRadioModule, MatSliderModule,
    FilterPipeModule
  ],
  providers: [HeaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
