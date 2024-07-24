import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// main
import { MainComponent } from './modules/main/main.component';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
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
