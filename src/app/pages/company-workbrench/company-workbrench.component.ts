import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyWorkbrenchService } from 'src/app/services/company-workbrench.service';

import { CompanyWorkbrench, ApiResponse } from 'src/app/models/api-models';

@Component({
  selector: 'app-company-workbrench',
  templateUrl: './company-workbrench.component.html',
  styleUrls: ['./company-workbrench.component.scss']
})
export class CompanyWorkbrenchComponent implements OnInit{
  isModalOpen = false; // Track modal open state
  isModalOpenHoliday = false; // Track modal open state

  title = '';

  //summernote
  configSummernote = {};

  formCW: FormGroup;
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

  constructor(private fb: FormBuilder, private companyworkbrenchService: CompanyWorkbrenchService) {
    this.formCW = this.fb.group({
      items: this.fb.array([])
    });
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
    const payloadListData = {
      limit: this.config.limit,
      offset: (page - 1) * this.config.limit
    };

    this.companyworkbrenchService.getCompanyWorkbrenches(payloadListData).subscribe({
      next: (res) => {
        console.log(res);
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
        }
      },
      error: (err) => {
        console.error(err);
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

  openModal(type: string, id: any) {
    this.title = this.getFormattedTitle(type);

    if (type === 'assign_holiday'){
      this.isModalOpenHoliday = true;
      this.addItem();
    } else {
      this.isModalOpen = true;

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
  }

  closeModal() {
    if (this.isModalOpen) {
      this.isModalOpen = false;
    } else {
        this.isModalOpenHoliday = false;
    }
  }

  getFormattedTitle(title: string): string {
    return title.replace(/_/g, ' ');
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

  onSubmit(): void {
    if (this.formCW.valid) {
      console.log(this.formCW.value);
    }
  }
}
