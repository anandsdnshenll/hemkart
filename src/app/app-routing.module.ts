import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { LandingComponent } from './layout/landing/landing.component';

const routes: Routes = [
  { path: '', component:LandingComponent  },
  { path: 'home', component: HomeComponent },
  {
    path: 'product',
    loadChildren: './product/product.module#ProductModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
