import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {
    
  }

  ngOnInit() {

  }

  login(){
    // redirect to home if already logged in
    this.router.navigate(['/']);

  }
}
