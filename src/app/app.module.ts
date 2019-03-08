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
import { GrdFilterPipe } from './shared/pipe/grd-filter.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ProductComponent } from './layout/product/product.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Restaurentdetail } from './layout/restaurentdetail/restaurentdetail.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListfoodModal } from './layout/listfood-modal/listfood-modal.component';
import { ShowrestaurantsComponent } from './layout/showrestaurants/showrestaurants.component';
import { CheckoutComponent } from './layout/checkout/checkout.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AddreviewComponent } from './layout/addreview/addreview.component';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatTableModule,
  MatTabsModule,
  MatFormFieldModule,
} from '@angular/material';

import {MatIconModule} from '@angular/material/icon'

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
    Restaurentdetail,
    ListfoodModal,
    ShowrestaurantsComponent,
    CheckoutComponent,
    AddreviewComponent,
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
    MatProgressSpinnerModule, 
    MatRadioModule, 
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule, 
    MatSelectModule,
    MatIconModule,
    MatBadgeModule,
    FilterPipeModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [HeaderService],
  bootstrap: [AppComponent],
  entryComponents: [
    ListfoodModal,
    AddreviewComponent
  ]
})
export class AppModule { }
