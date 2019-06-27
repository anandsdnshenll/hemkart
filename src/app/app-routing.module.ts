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
import { WorkorderComponent } from './layout/workorder/workorder.component';
import { NotfoundComponent } from './layout/notfound/notfound.component';

const routes: Routes = [
  { path: '', component:LandingComponent, data: {title: "HemkörtochKlart.se - Beställ hemkörning av mat online!"},  },
  { path: 'store', component: HomeComponent, data: {title: "HemkörtochKlart.se - Beställ hemkörning av mat online!"},},
  { path: 'Restauranglista', component: ProductComponent, data: {title: "Restauranglista"}},
  { path: 'restaurants', redirectTo: '/Restauranglista/:id' },
  { path: 'merchants', component: Restaurentdetail, data: {title: "Burger King  meny | Beställ Online - HemkörtochKlart.se"} },
  { path: 'city-restaurants', component: ShowrestaurantsComponent },
  { path: 'PaymentOption', component: CheckoutComponent, data: {title: "Hemkört&Klart - PaymentOption Store"} },
  { path: 'success', component: SuccessComponent, data: {title: 'Hemkört&Klart - Receipt Store'} },
  { path: 'confirmation', component: KlarnainfoComponent, data: {title: 'Hemkört&Klart - klarna'} },
  { path: 'OrderHistory', component: OrderhistoryComponent, data: {title: 'Hemkört&Klart - OrderHistory'} },
  { path: 'workorder', component: WorkorderComponent, data: {title: "Work order | Beställ Online - HemkörtochKlart.se"} },
  { path: '**', component: NotfoundComponent, data: {title: "404 Not found!"} },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
