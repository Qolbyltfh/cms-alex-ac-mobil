import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// main
import { MainComponent } from './modules/main/main.component';
import { LoginComponent } from './modules/login/login.component';
import { BlankComponent } from './pages/blank/blank.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'blank',
        component: BlankComponent
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
