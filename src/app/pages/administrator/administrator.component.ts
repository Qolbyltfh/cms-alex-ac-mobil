import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { UsersService } from 'src/app/services/users.service';
import { ConstantService } from 'src/app/services/constant.service';
import { Users, Role } from 'src/app/models/user-models';
import { CompanyWorkbrench } from 'src/app/models/api-models';
import { Helpers } from '../../helpers/helpers';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit{
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

  constructor(private userService: UsersService, private masterService: ConstantService, private fb: FormBuilder, private toastr: ToastrService, private helpers: Helpers) {
  }

  ngOnInit(): void {
    this.getAdministrator(1);
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

          // Filter list_role to include only 'superadmin' and 'supervisor'
          const filteredRoles = this.list_role.filter(role => 
            role.name === 'superadmin' || role.name === 'supervisor'
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
    this.getRoles();
    this.getCompanyWorkbrench();
    this.createForm();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit(type: string): void {
    this.formUA.markAllAsTouched();
    if (this.formUA.valid) {
      let payloadData = this.helpers.copyObject(this.formUA.getRawValue());
      payloadData.status = 'active;'

      if (type === 'create'){
        this.userService.createUser(payloadData).subscribe({
          next: (res) => {
            this.closeModal();
            this.getAdministrator(1);
            console.log('User updated successfully', res);
            this.toastr.success('Successfully added data', 'Berhasil!');
          },
          error: (err) => {
            console.error('Error updating User', err);
            this.toastr.error('Failed to added data', 'Kesalahan!');
          }
        });
      }
    }
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
