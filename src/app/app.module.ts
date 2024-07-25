import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { MainComponent } from './modules/main/main.component';
import { HeaderComponent } from './modules/main/header/header.component';
import { MenuSidebarComponent } from './modules/main/menu-sidebar/menu-sidebar.component';
import { FooterComponent } from './modules/main/footer/footer.component';
import { ControlSidebarComponent } from './modules/main/control-sidebar/control-sidebar.component';

// Plugins
import {ToastrModule} from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';

// pages
import { BlankComponent } from './pages/blank/blank.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { AdministratorComponent } from './pages/administrator/administrator.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CompanyWorkbrenchComponent } from './pages/company-workbrench/company-workbrench.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    MenuSidebarComponent,
    FooterComponent,
    ControlSidebarComponent,
    BlankComponent,
    CustomersComponent,
    AdministratorComponent,
    EmployeeComponent,
    OrdersComponent,
    CompanyWorkbrenchComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      newestOnTop: true,
      maxOpened: 1,
      messageClass: 'toast-message pre-line'
  }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
