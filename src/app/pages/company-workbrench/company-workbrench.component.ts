import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  config = {};

  formCW: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formCW = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {

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

      this.config = {
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
