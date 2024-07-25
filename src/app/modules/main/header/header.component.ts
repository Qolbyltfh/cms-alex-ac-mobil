import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;

  constructor(
    private router: Router,
  ) {
    
  }

  ngOnInit() {

  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(){
    // redirect to login page
    this.router.navigate(['/login']);

  }
}
