import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/index';
import { AuthGuard } from './_services/index';
import { CategoryComponent } from './category/index';
import { CategoryDetailComponent } from './category/index';
import { BrandComponent } from './brand/index';
import { BrandDetailComponent } from './brand/index';
import { ItemComponent } from './item/index';
import { ItemDetailComponent } from './item/index';
import { UserComponent } from './user/index';
import { UserDetailComponent } from './user/index';
import { UserPasswordComponent } from './user/index';
import { SaleComponent } from './sale/index';
import { SaleDetailComponent } from './sale/index';
import { PaymentMethodComponent } from './payment-method/index';
import { PaymentMethodDetailComponent } from './payment-method/index';
import { ReportComponent } from './report/index';


const routes: Routes = [
  { path: 'admin/user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'admin/user/detail/:id' , component: UserDetailComponent, canActivate: [AuthGuard] },
  { path: 'admin/user/password/:id' , component: UserPasswordComponent, canActivate: [AuthGuard] },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'category/detail/:id' , component: CategoryDetailComponent, canActivate: [AuthGuard] },
  { path: 'brand', component: BrandComponent, canActivate: [AuthGuard] },
  { path: 'brand/detail/:id' , component: BrandDetailComponent, canActivate: [AuthGuard] },
  { path: 'item', component: ItemComponent, canActivate: [AuthGuard] },
  { path: 'item/detail/:id' , component: ItemDetailComponent, canActivate: [AuthGuard] },
  { path: 'sale' , component: SaleComponent, canActivate: [AuthGuard] },
  { path: 'sale/detail/:id' , component: SaleDetailComponent, canActivate: [AuthGuard] },
  { path: 'sale/payment-method' , component: PaymentMethodComponent, canActivate: [AuthGuard] },
  { path: 'sale/payment-method/detail/:id' , component: PaymentMethodDetailComponent, canActivate: [AuthGuard] },
  { path: 'report/sale' , component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/sale/detail/new', pathMatch: 'full' },
  // { path: '**', component: CategoryComponent } // TODO PageNotFoundComponent
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
