import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// helpers
import { AuthGuard } from './helpers/auth.guard';

// main
import { MainComponent } from './modules/main/main.component';
import { LoginComponent } from './modules/login/login.component';
import { BlankComponent } from './pages/blank/blank.component';

// pages
import { CustomersComponent } from './pages/customers/customers.component';
import { AdministratorComponent } from './pages/administrator/administrator.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CompanyWorkbrenchComponent } from './pages/company-workbrench/company-workbrench.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'blank',
        component: BlankComponent
      },
      {
        path: 'customers',
        component: CustomersComponent
      },
      {
        path: 'administrator',
        component: AdministratorComponent
      },
      {
        path: 'employee',
        component: EmployeeComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'company-workbrench',
        component: CompanyWorkbrenchComponent
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
