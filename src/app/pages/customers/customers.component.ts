import { Component , OnInit} from '@angular/core';

import { UsersService } from 'src/app/services/users.service';
import { Users, User } from 'src/app/models/user-models';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit{
  isModalOpen = false; // Track modal open state

  // pagination
  list_data: Users[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  config = {
    limit: 10, // Jumlah item per halaman
    currentPage: 1,
    total: 0,
    offset: 0
  };

  //detail data
  detail_data: User = {} as User;

  constructor(private userService: UsersService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getCustomers(this.config.currentPage);
  }

  checkNumberList(index: any) {
    return Number(index) + ((this.config.currentPage - 1) * this.config.limit) + 1
  }
  
  onPageChange(page: number): void {
    this.getCustomers(page);
  }

  getCustomers(page: number): void {
    this.spinner.show();

    const payloadListData = {
      limit: this.config.limit,
      offset: (page - 1) * this.config.limit
    };

    this.userService.getCustomers(payloadListData).subscribe({
      next: (res) => {
        if (res) {
          this.list_data = res.data;
          this.config = {
            currentPage: res.meta.currentPage,
            total: res.meta.total,
            limit: res.meta.limit,
            offset: res.meta.offset
          };
          this.totalPages = Math.ceil(this.config.total / this.config.limit);
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.spinner.hide();

        } else {
          this.toastr.warning('No data found', 'Warning!');
          this.spinner.hide();

        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to get data', 'Error!');
        this.spinner.hide();

      }
    });
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  openModal(data: any) {
    this.isModalOpen = true;
    this.detail_data = data;
    console.log(this.detail_data)
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
