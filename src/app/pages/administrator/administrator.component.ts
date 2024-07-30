import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/user-models';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit{
  isModalOpen = false; // Track modal open state
  title = '';

  // pagination
  list_data: Users[] = [];
  currentPage: number = 1;
  totalPages: any;
  pages: number[] = [];
  config = {
    limit: 10, // Jumlah item per halaman
    currentPage: 1,
    total: 0,
    offset: 0
  };

  //detail data
  detail_data = {};

  constructor(private userService: UsersService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getAdministrator(1);
  }

  checkNumberList(index: any) {
    return Number(index) + ((this.config.currentPage - 1) * this.config.limit) + 1
  }
  
  getAdministrator(page: number): void {
    const payloadListData = {
      limit: this.config.limit,
      offset: (page - 1) * this.config.limit
    };

    this.userService.getAdministrator(payloadListData).subscribe({
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
        } else {
          this.toastr.warning('No data found', 'Warning!');
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to get data', 'Error!');
      }
    });
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  openModal(type: string, data: any) {
    this.title = type;
    this.isModalOpen = true;
    this.detail_data = data;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
