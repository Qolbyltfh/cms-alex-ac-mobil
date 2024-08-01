import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../../services/account.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
    loading = false;
    submitted = false;
    error?: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    // redirect to home if already logged in
    if (this.accountService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.spinner.show();

    this.submitted = true;

    // reset alert on submit
    this.error = '';

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.accountService.login(this.f['email'].value, this.f['password'].value)
        .pipe(first())
        .subscribe({
            next: () => {
                // get return url from query parameters or default to home page
                this.router.navigateByUrl('/dashboard');
                this.spinner.show();
                this.toastr.success('Login Success', 'Success!');
                
            },
            error: error => {
                this.error = error;
                this.loading = false;
                this.spinner.show();
                this.toastr.error(error, 'Danger!');

            }
        });
  }

}
