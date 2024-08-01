import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CompanyWorkbrenchService } from 'src/app/services/company-workbrench.service';
import { ConstantService } from 'src/app/services/constant.service';

import { CompanyWorkbrench, ApiResponse } from 'src/app/models/api-models';
import { Helpers } from '../../helpers/helpers';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-company-workbrench',
  templateUrl: './company-workbrench.component.html',
  styleUrls: ['./company-workbrench.component.scss']
})
export class CompanyWorkbrenchComponent implements OnInit{
  isModalOpen = false; // Track modal open state
  isModalOpenHoliday = false; // Track modal open state
  isConfirmDelete = false;
  isEdit = false;
  id_detail = '';
  data_detail = {};
  tempImage = '';

  title = '';
  //summernote
  configSummernote = {};

  formCW!: FormGroup;
  list_data: CompanyWorkbrench[] = [];
  currentPage: number = 1;
  totalPages: any;
  pages: number[] = [];
  config = {
    limit: 10, // Jumlah item per halaman
    currentPage: 1,
    total: 0,
    offset: 0
  };

  constructor(private fb: FormBuilder, private companyworkbrenchService: CompanyWorkbrenchService, private masterService: ConstantService, private helpers: Helpers, private toastr: ToastrService, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getCompanyWorkbrenches(this.currentPage);
  }

  checkNumberList(index: any) {
    return Number(index) + ((this.config.currentPage - 1) * this.config.limit) + 1
  }

  // format time
  formatTime(time: string): string {
    if (!time) return '-';
    return time.slice(0, 5);
  }
  
  getCompanyWorkbrenches(page: number): void {
    this.spinner.show();

    const payloadListData = {
      limit: this.config.limit,
      offset: (page - 1) * this.config.limit
    };

    this.companyworkbrenchService.getCompanyWorkbrenches(payloadListData).subscribe({
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
          this.toastr.warning('Tidak ada data', 'Peringatan!');
          this.spinner.hide();
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Gagal mendapatkan data', 'Kesalahan!');
        this.spinner.hide();

      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getCompanyWorkbrenches(this.currentPage);
  }

  onPageChange(page: number): void {
    this.getCompanyWorkbrenches(page);
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  configWYSWYG(){
    this.configSummernote = {
      tabsize: 2,
      height: '200px',
      // uploadImagePath: '/api/upload',
      toolbar: [
          ['misc', ['codeview', 'undo', 'redo']],
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
          ['fontsize', ['fontname', 'fontsize', 'color']],
          ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
          ['insert', ['table', 'picture', 'link', 'video', 'hr']]
      ],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
    }
  }

  createForm() {
    this.formCW = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      description: new FormControl(null),
      address: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      open_time: new FormControl(null, Validators.required),
      close_time: new FormControl(null, Validators.required),
      lat: new FormControl(null, Validators.required),
      long: new FormControl(null, Validators.required),
    });
  }


  openModal(type: string, data: any) {
    this.title = this.getFormattedTitle(type);
    this.tempImage = '';
    this.id_detail = data.id;

    if (type === 'assign_holiday'){
      this.isModalOpenHoliday = true;
      this.formCW = this.fb.group({
        items: this.fb.array([])
      });
      this.addItem();
    } else {
      this.isEdit = false;

      this.configWYSWYG();
      this.createForm();


      if (type === 'edit'){
        this.isEdit = true;
        this.data_detail = data;
        this.formCW.patchValue(this.data_detail);
        this.tempImage = data.image;
      }
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isEdit = false;
    if (this.isModalOpen) {
      this.isModalOpen = false;
    } else {
        this.isModalOpenHoliday = false;
    }
  }

  getFormattedTitle(title: string): string {
    return title.replace(/_/g, ' ');
  }

  generateGoogleMapsLink(lat: string | number, long: string | number): string {
    const latitude = Number(lat);
    const longitude = Number(long);
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  get items(): FormArray {
    return this.formCW.get('items') as FormArray;
  }

  addItem(): void {
    const itemForm = this.fb.group({
      start_date: [''],
      end_date: ['']
    });

    this.items.push(itemForm);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  get f() { return this.formCW.controls; };

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
            this.formCW.patchValue({ image: res.data.link });
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

  onSubmit(type: string): void {
    this.formCW.markAllAsTouched();
    if (this.formCW.valid) {
      this.spinner.show();

      if (type === 'assign_holiday'){

      } else {
        const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
        let payloadData = this.helpers.copyObject(this.formCW.getRawValue());
        
        // constant day
        payloadData.day = day;

        if (!this.isEdit){
          this.companyworkbrenchService.createCompanyWOrkbrench(payloadData).subscribe({
            next: (res) => {
              this.closeModal();
              this.getCompanyWorkbrenches(1);
              console.log('Company Workbrench updated successfully', res);
              this.toastr.success('Successfully added data', 'Berhasil!');
              this.spinner.hide();

            },
            error: (err) => {
              console.error('Error updating Company Workbrench', err);
              this.toastr.error('Failed to added data', 'Kesalahan!');
              this.spinner.hide();

            }
          });
        } else {
          this.companyworkbrenchService.updateCompanyWOrkbrench(payloadData, this.id_detail).subscribe({
            next: (res) => {
              this.closeModal();
              this.getCompanyWorkbrenches(1);
              console.log('Company Workbrench updated successfully', res);
              this.toastr.success('Successfully updated data', 'Berhasil!');
              this.spinner.hide();

            },
            error: (err) => {
              console.error('Error updating Company Workbrench', err);
              this.toastr.error('Failed to updated data', 'Kesalahan!');
              this.spinner.hide();

            }
          });
        }
      }
      this.spinner.hide();

    }
  }

  getFormControl(name: string) {
    return this.formCW.controls[name];
  }

  checkErrorFormControl(name: string) {
    return this.helpers.checkErrorFormControl(this.getFormControl(name));
  }

  showErrorFormControl(name: string) {
    return this.helpers.showErrorFormControl(this.getFormControl(name));
  }
  
  // pattern
  preventNonNumeric(event: KeyboardEvent) {
    const keyCode = event.which ? event.which : event.keyCode;
    const keyValue = String.fromCharCode(keyCode);
    
    if (!/^[0-9]*$/.test(keyValue) && keyCode !== 8 && keyCode !== 46) {
      event.preventDefault();
    }
  }
  
  preventNonNumericPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('Text');
    
    if (!/^[0-9]*$/.test(pastedText)) {
      event.preventDefault();
    }
  }

  // delete
  confirmDelete(id: string){
    this.isConfirmDelete = true;
    this.id_detail = id;
  }

  closeConfirm(){
    this.isConfirmDelete = false;
  }

  delete(){
    this.companyworkbrenchService.deleteCompanyWOrkbrench(this.id_detail).subscribe({
      next: (res) => {
        this.closeConfirm();
        this.getCompanyWorkbrenches(1);
        console.log('Company Workbrench deleted successfully', res);
        this.toastr.success('Successfully deleted data', 'Success!');
      },
      error: (err) => {
        console.error('Error updating Company Workbrench', err);
        this.toastr.error('Failed to update data', 'Error!');

      }
    });
  }
  
}
