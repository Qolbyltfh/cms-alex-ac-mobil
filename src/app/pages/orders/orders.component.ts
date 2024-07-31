import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Order, OrderDetail, OrderStatus, OrderItem } from 'src/app/models/api-models';
import { OrderService } from 'src/app/services/order.service';
import { Helpers } from '../../helpers/helpers';
import { ToastrService } from 'ngx-toastr';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ConstantService } from 'src/app/services/constant.service';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/user-models';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit{
  isModalOpen = false; // Track modal open state
  isModalOpenDetail = false; // Track modal open state
  isAssign = false;

  title = '';
  statusOptions: OrderStatus[] = [];

  mechanicOptions: Users[] = [];

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
  id_order= null;

  constructor(private fb: FormBuilder, private orderService: OrderService,private masterService: ConstantService, private userService: UsersService, private toastr: ToastrService, private helpers: Helpers) {
    this.form = this.fb.group({
      status: [''],
      description: [''],
      items: this.fb.array([]),
      mechanic: [''],
    });
  }

  ngOnInit(): void {
      this.getOrders(1);
      this.getOrderStatus();
      this.isAssign = false;
  }

  openModal(type: string, id: any) {
    this.title = this.getFormattedTitle(type);
    this.id_order = id;
    this.getOrderDetail(this.id_order);

    if(type === 'assign_mechanic'){
      this.isAssign = true;
      this.getMechanic();
    } 

    if (type === 'detail_order'){
      this.isModalOpenDetail = true;
    } else {
      this.isModalOpen = true;
      // Watch for status changes to update form fields
      this.form.get('status')?.valueChanges.subscribe((value) => {
        this.selectedStatus = value;
        this.updateValidators();
      });
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
      name: [''],  // Require item name
      price: [0, [Validators.min(0)]],  // Require price to be non-negative
      quantity: [1, [Validators.min(1)]]  // Require quantity to be at least 1
    });

    this.items.push(itemForm);
  }

  updateValidators(): void {
    // Update validators based on selected status
    if (this.selectedStatus === 'waiting-payment') {
      this.form.get('description')?.setValidators([Validators.required]);
    } else {
      this.form.get('description')?.clearValidators();
    }
    this.form.get('description')?.updateValueAndValidity();
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
    if(this.isAssign){
      const selectedMechanicId = this.form.get('mechanic')?.value;
      const selectedMechanic = this.mechanicOptions.find(m => m.id === selectedMechanicId);

      const itemPayload = {
        mechanic_id: selectedMechanic?.id || '',
        mechanic_name: selectedMechanic?.name || ''
      };

      this.orderService.updateMechanic(itemPayload, this.id_order).subscribe({
        next: (res) => {
          this.getOrders(1);
          this.isAssign =false;
          this.closeModal();
          console.log('Order item updated successfully', res);
          this.toastr.success('Successfully updated item data', 'Berhasil!');
        },
        error: (err) => {
          console.error('Error updating Order item', err);
          this.toastr.error('Failed to update item data', 'Kesalahan!');
        }
      });
    } else {
      if (this.form.valid) {
        // Get a copy of the form values
        let payloadData = this.helpers.copyObject(this.form.getRawValue());
    
        // TypeScript type assertion to specify payloadData.items as an array of OrderItem
        (payloadData.items as OrderItem[]).forEach((item) => {
          // Transform each item to the required structure
          const itemPayload = {
            name: item.name, // Assuming 'item' key maps to 'name'
            price: Number(item.price), // Ensure price is a number
            quantity: item.quantity,
            order_id: this.id_order, // Assuming this.id_order is defined
          };
    
          // Send the update request for each item
          this.orderService.updateOrderItem(itemPayload).subscribe({
            next: (res) => {
              console.log('Order item updated successfully', res);
              this.toastr.success('Successfully updated item data', 'Berhasil!');
            },
            error: (err) => {
              console.error('Error updating Order item', err);
              this.toastr.error('Failed to update item data', 'Kesalahan!');
            }
          });
        });
    
        // Update the entire order after updating items
        this.orderService.updateOrder(payloadData, this.id_order).subscribe({
          next: (res) => {
            this.closeModal();
            this.getOrders(1);
            console.log('Order updated successfully', res);
            this.toastr.success('Successfully updated order data', 'Berhasil!');
          },
          error: (err) => {
            console.error('Error updating Order', err);
            this.toastr.error('Failed to update order data', 'Kesalahan!');
          }
        });
      }
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
  getOrderDetail(id: any): void {
    this.orderService.getOrderDetail(id).subscribe({
      next: (res) => {
        if (res) {
          this.detail_order = res.data as OrderDetail;
          this.detail_order.service_at = this.reformatDate(this.detail_order.service_at);
          this.detail_order.createdAt = this.reformatDate(this.detail_order.createdAt);
          this.form.patchValue(this.detail_order);
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

  // get list status
  getOrderStatus(): void {
    this.masterService.getOrderStatus().subscribe({
      next:(res) => {
        if (res){
          this.statusOptions = res.data as OrderStatus[];
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // get list mechanic
  getMechanic(): void {
    const payloadListData = {
      limit: 100,
    };
    this.userService.getMechanic(payloadListData).subscribe({
      next:(res) => {
        if (res){
          this.mechanicOptions = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
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
