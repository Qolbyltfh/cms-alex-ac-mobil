import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from 'src/app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  name = '';
  email = '';
  image = '';

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private accountService: AccountService
  ) {
    
  }

  ngOnInit() {
    if (localStorage.getItem('user')){
      const data = localStorage.getItem('user');
      const parsedData = JSON.parse(data || '{}');
      this.name = parsedData.data.name;
      this.email = parsedData.data.email;
      this.image = parsedData.data.image;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(){
    this.spinner.show();
    this.accountService.logout();
  }
}
