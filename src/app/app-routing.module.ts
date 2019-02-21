import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { LandingComponent } from './layout/landing/landing.component';
import { ProductComponent } from './layout/product/product.component';

const routes: Routes = [
  { path: '', component:LandingComponent  },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
