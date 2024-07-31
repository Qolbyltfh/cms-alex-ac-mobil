import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Order, OrderDetail } from 'src/app/models/api-models';
import { OrderService } from 'src/app/services/order.service';
import { Helpers } from '../../helpers/helpers';
import { ToastrService } from 'ngx-toastr';
import { Moment } from 'moment';
import * as moment from 'moment';

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

  // pagination
  list_data: Order[] = [];
  currentPage: number = 1;
  totalPages: any;
  pages: number[] = [];
  config = {
    limit: 10, // Jumlah item per halaman
    currentPage: 1,
    total: 0,
    offset: 0
  };

  // detail order
  detail_order: OrderDetail = {};


  constructor(private fb: FormBuilder, private orderService: OrderService, private toastr: ToastrService, private helpers: Helpers) {
    this.form = this.fb.group({
      status: [''],
      description: [''],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
      this.getOrders(1);
  }

  openModal(type: string, id: any) {
    this.title = this.getFormattedTitle(type);

    if (type === 'detail_order'){
      this.isModalOpenDetail = true;
      this.getOrderDetail(id);
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

  getOrders(page: number): void {
    const payloadListData = {
      limit: this.config.limit,
      offset: (page - 1) * this.config.limit
    };

    this.orderService.getOrders(payloadListData).subscribe({
      next: (res) => {
        if (res) {
          this.list_data = res.data;
          this.config = {
            currentPage: res.meta.currentPage,
            total: res.meta.total,
            limit: res.meta.limit,
            offset: res.meta.offset
          };
          this.list_data.forEach(obj => {
            obj.createdAt = this.reformatDate(obj.createdAt);
            obj.service_at = this.reformatDate(obj.service_at);
            obj.updatedAt = this.reformatDate(obj.updatedAt);
          });
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

  // detail
  getOrderDetail(id: string): void {
    this.orderService.getOrderDetail(id).subscribe({
      next: (res) => {
        if (res) {
          console.log(res)
          this.detail_order = res.data as OrderDetail;
          this.detail_order.service_at = this.reformatDate(this.detail_order.service_at);
          this.detail_order.createdAt = this.reformatDate(this.detail_order.createdAt);
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

  checkNumberList(index: any) {
    return Number(index) + ((this.config.currentPage - 1) * this.config.limit) + 1
  }

  reformatDate(data: any) {
    let formatedDate;
    if (data) {
      formatedDate = moment(data, "YYYY-MM-DD HH:mm:ss", true).isValid()
        ? moment(data, "YYYY-MM-DD HH:mm:ss", true).format('DD MMM YYYY, HH:mm:ss') 
        : moment(data).format('DD MMM YYYY');
    } else {
      formatedDate = null;
    }
    return formatedDate;
  }
}
