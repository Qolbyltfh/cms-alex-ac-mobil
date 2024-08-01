import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { UsersService } from 'src/app/services/users.service';
import { ConstantService } from 'src/app/services/constant.service';
import { Users, Role } from 'src/app/models/user-models';
import { CompanyWorkbrench } from 'src/app/models/api-models';
import { Helpers } from '../../helpers/helpers';
import { ToastrService } from 'ngx-toastr';
import * as bcrypt from 'bcryptjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit{
  isModalOpen = false; // Track modal open state
  title = '';
  list_role: Role[] = [];
  filteredRoles: Role[] = [];
  list_company_branch: CompanyWorkbrench[] = [];

  isEdit = false;
  id_detail = '';
  data_detail = {};
  tempImage = '';
  formUA!: FormGroup;

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

  constructor(private userService: UsersService, private masterService: ConstantService, private fb: FormBuilder, private toastr: ToastrService, private helpers: Helpers, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getEmployee(1);
  }
  
  getCompanyWorkbrench(): void {
    this.userService.getListCompanyWorkbrench().subscribe({
      next:(res) => {
        if (res){
          this.list_company_branch = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getRoles(): void {
    this.masterService.getRole().subscribe({
      next:(res) => {
        if (res){
          this.list_role = res.data.map((role: any) => ({
            ...role,
            deletedAt: role.deletedAt ? new Date(role.deletedAt) : null
          }));

          // Filter list_role to include only 'mechanic' and 'admin'
          const filteredRoles = this.list_role.filter(role => 
            role.name === 'mechanic' || role.name === 'admin'
          );

          // Alternatively, store filtered roles in a class property if needed elsewhere
          this.filteredRoles = filteredRoles;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onPageChange(page: number): void {
    this.getEmployee(page);
  }

  getEmployee(page: number): void {
    this.spinner.show();

    const payloadListData = {
      limit: this.config.limit,
      offset: (page - 1) * this.config.limit
    };

    this.userService.getEmployee(payloadListData).subscribe({
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

  
  createForm() {
    this.formUA = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      image: new FormControl(null),
      role_id: new FormControl(null, Validators.required),
      company_branch_id: new FormControl(null, Validators.required),
    });
  }


  openModal(type: string, data: any) {
    this.title = type;
    this.tempImage = '';
    this.getRoles();
    this.getCompanyWorkbrench();
    this.createForm();
    if (type === 'edit'){
      this.isEdit = true;
      this.id_detail = data.id;
      this.detail_data = data;
      this.formUA.patchValue(this.detail_data);
      const formData = this.formUA.value;
      if (formData.password) {
        // Hash the password using bcrypt
        const salt = bcrypt.genSaltSync(10);
        formData.password = bcrypt.hashSync(formData.password, salt);
      }
      this.tempImage = data.image;
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit(type: string): void {
    this.formUA.markAllAsTouched();
    if (this.formUA.valid) {
      this.spinner.show();

      let payloadData = this.helpers.copyObject(this.formUA.getRawValue());
      payloadData.status = 'active'

      if (!this.isEdit){
        this.userService.createUser(payloadData).subscribe({
          next: (res) => {
            this.closeModal();
            this.getEmployee(1);
            console.log('User updated successfully', res);
            this.toastr.success('Successfully added data', 'Berhasil!');
            this.spinner.hide();

          },
          error: (err) => {
            console.error('Error updating User', err);
            this.toastr.error('Failed to added data', 'Kesalahan!');
            this.spinner.hide();

          }
        });
      } else {
        this.userService.updateUser(payloadData, this.id_detail).subscribe({
          next: (res) => {
            this.closeModal();
            this.getEmployee(1);
            console.log('User updated successfully', res);
            this.toastr.success('Successfully updated data', 'Berhasil!');
            this.spinner.hide();

          },
          error: (err) => {
            console.error('Error updating User', err);
            this.toastr.error('Failed to updated data', 'Kesalahan!');
            this.spinner.hide();

          }
        });
      }
    }
  }

  get f() { return this.formUA.controls; };

  checkNumberList(index: any) {
    return Number(index) + ((this.config.currentPage - 1) * this.config.limit) + 1
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.masterService.uploadImage(formData).subscribe({
        next: (res: any) => {
          if (res.status) {
            // Store the image URL in the form control
            this.tempImage = res.data.link;
            this.formUA.patchValue({ image: res.data.link });
            console.log('Image uploaded successfully, URL:', res.data.link);
          } else {
            console.error('Image upload failed');
          }
        },
        error: (err) => {
          console.error('Error uploading image', err);
        }
      });
    }
  }

  getFormControl(name: string) {
    return this.formUA.controls[name];
  }

  checkErrorFormControl(name: string) {
    return this.helpers.checkErrorFormControl(this.getFormControl(name));
  }

  showErrorFormControl(name: string) {
    return this.helpers.showErrorFormControl(this.getFormControl(name));
  }
}
