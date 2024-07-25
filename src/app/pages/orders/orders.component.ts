import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit{
  isModalOpen = false; // Track modal open state
  isModalOpenDetail = false; // Track modal open state

  title = '';
  statusOptions = [
    { value: '', name: 'Filter by status' },
    { value: 'pending', name: 'Pending' },
    { value: 'pickup', name: 'Pick Up' },
    { value: 'cheking', name: 'Cheking' },
    { value: 'cheking-confirmation', name: 'Cheking Confirmation' },
    { value: 'inprogress', name: 'In Progress' },
    { value: 'delivery', name: 'Delivery' },
    { value: 'waiting-payment', name: 'Waiting Payment' },
    { value: 'complete', name: 'Complete' },
  ];
  mechanicOptions = [
    { value: '', name: 'Select Mechanic' },
    { value: 'mechanic1', name: 'Kevin' },
    { value: 'mechanic2', name: 'Charles' },
    { value: 'mechanic3', name: 'David' },
  ];

  selectedStatus = ''; // for storing selected value

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      status: [''],
      description: [''],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
      
  }

  openModal(type: string, id: any) {
    this.title = this.getFormattedTitle(type);

    if (type === 'detail_order'){
      this.isModalOpenDetail = true;
    } else {
      this.isModalOpen = true;
    }
    this.addItem();
  }

  closeModal() {
    if (this.isModalOpen) {
      this.isModalOpen = false;
    } else {
        this.isModalOpenDetail = false;
    }
  }

  getFormattedTitle(title: string): string {
    return title.replace(/_/g, ' ');
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemForm = this.fb.group({
      item: [''],
      price: [0, [Validators.min(0)]],
      qty: [1, [Validators.min(1)]]
    });

    this.items.push(itemForm);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // change status

  changeStatus(data: string) : void {
    this.selectedStatus = data;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
