import { Component } from '@angular/core';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent {
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
