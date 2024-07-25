import { Component } from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {
  isModalOpen = false; // Track modal open state
  title = '';

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  openModal(type: string, id: any) {
    this.title = type;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
