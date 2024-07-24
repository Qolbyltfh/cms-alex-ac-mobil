import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { BlankComponent } from './pages/blank/blank.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { AdministratorComponent } from './pages/administrator/administrator.component';

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
    AdministratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
