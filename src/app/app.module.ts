import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './_dialogs/index';
import { InvalidateDialogComponent } from './_dialogs/index';

import { CustomMatPaginatorIntl } from './_services/index';
import { MatPaginatorIntl } from '@angular/material';

import { DateAdapter } from '@angular/material';
import { CustomDateAdapter } from './_services/index';

import { AppComponent } from './app.component';
import { CategoryComponent } from './category/index';
import { CategoryDetailComponent } from './category/index';
import { BrandComponent } from './brand/index';
import { BrandDetailComponent } from './brand/index';
import { ItemComponent } from './item/index';
import { ItemDetailComponent } from './item/index';
import { LoginComponent } from './login/index';
import { MenuComponent } from './menu/index';
import { UserComponent } from './user/index';
import { UserDetailComponent } from './user/index';
import { UserPasswordComponent } from './user/index';
import { SaleComponent } from './sale/index';
import { SaleDetailComponent } from './sale/index';
import { PaymentMethodComponent } from './payment-method/index';
import { PaymentMethodDetailComponent } from './payment-method/index';
import { ReportComponent } from './report/index';

import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './_services/index';
import { AuthGuard } from './_services/index';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptor } from './_services/index';

import { CategoryService } from './_services/index';
import { BrandService } from './_services/index';
import { ItemService } from './_services/index';
import { UserService } from './_services/index';
import { SaleService } from './_services/index';
import { PaymentMethodService } from './_services/index';
import { ReportService } from './_services/index';


@NgModule({
  declarations: [
    AppComponent,
    DeleteDialogComponent,
    InvalidateDialogComponent,
    CategoryComponent,
    CategoryDetailComponent,
    BrandComponent,
    BrandDetailComponent,
    ItemComponent,
    ItemDetailComponent,
    LoginComponent,
    MenuComponent,
    UserComponent,
    UserDetailComponent,
    UserPasswordComponent,
    SaleComponent,
    SaleDetailComponent,
    PaymentMethodComponent,
    PaymentMethodDetailComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    AppRoutingModule
  ],
  entryComponents: [
    DeleteDialogComponent,
    InvalidateDialogComponent
  ],
  providers: [
    HttpClientModule,
    AuthService,
    AuthGuard,
    CategoryService,
    BrandService,
    ItemService,
    UserService,
    SaleService,
    PaymentMethodService,
    ReportService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-CL'
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
