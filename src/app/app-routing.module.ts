import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { LandingComponent } from './layout/landing/landing.component';
import { ProductComponent } from './layout/product/product.component';
import { Restaurentdetail } from './layout/restaurentdetail/restaurentdetail.component';
import { ShowrestaurantsComponent } from './layout/showrestaurants/showrestaurants.component';
import { CheckoutComponent } from './layout/checkout/checkout.component';
import { SuccessComponent } from './layout/success/success.component';
import { KlarnainfoComponent } from './layout/klarnainfo/klarnainfo.component';
import { OrderhistoryComponent } from './layout/orderhistory/orderhistory.component';

const routes: Routes = [
  { path: '', component:LandingComponent  },
  { path: 'home', component: HomeComponent },
  { path: 'allmerchants', component: ProductComponent },
  { path: 'restaurants', redirectTo: '/allmerchants/:id' },
  { path: 'merchants', component: Restaurentdetail },
  { path: 'city-restaurants', component: ShowrestaurantsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'confirmation', component: KlarnainfoComponent },
  { path: 'OrderHistory', component: OrderhistoryComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
