import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ToastMessageComponent } from 'src/app/toast-message/toast-message.component';
import { StatusService } from './status-service';
import { from } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/layout/shared/shared.module';


export interface Level {
  id: number;
  statusName: string;
  isEditing?: boolean;
}

@Component({
  selector: 'app-status-master',
  standalone: true,
  imports: [ToastMessageComponent,SharedModule, CommonModule,FormsModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './status-master.component.html',
  styleUrl: './status-master.component.scss'
})
export class StatusMasterComponent {

  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;

  showModal: boolean = false;
  newStatusName: string = '';
  itemsPerPage: number = 10;

  rows: Level[] = [];
  currentlyEditingIndex: number = -1;
  tableFlag: boolean = false;
  selectedAttribute: any;
  pageSize = 5;
  currentPage = 1;
  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
    this.getAllStatus();
  }

  getAllStatus(page: number = 0): void {
    this.statusService.getAllStatus(page, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.rows = response.content.sort((a: any, b: any) => b.id - a.id);
      },
      error: (err) => {
        console.error('Failed to load roles', err);
      }
    });
  }

  addRow() {
    if (this.currentlyEditingIndex === -1) {
      this.rows.unshift({
        statusName: '',
        isEditing: true,
        id: 0
      });
      this.currentlyEditingIndex = 0;
      this.currentPage = 1;
    }
  }

  editRow(row: Level) {
    if (this.currentlyEditingIndex === -1) {
      this.currentlyEditingIndex = this.rows.indexOf(row);
      row.isEditing = true;
    }
  }

  saveRow(row: Level) {
    if (row.statusName === '') {
      return;
    }

    row.isEditing = false;
    this.currentlyEditingIndex = -1;

    if (row.id) {
      this.updateToApi(row);
    } else {
      this.saveToApi(row);
    }
  }

  sanitizeInput(row: any): void {

    const disallowedCharacters = /[^a-zA-Z0-9\s]/g;  
    if (disallowedCharacters.test(row.statusName)) {
      this.triggerToast("Error", "Please Enter Valid Input", "danger");
    }
    row.statusName = row.statusName.replace(disallowedCharacters, '');
  }

  cancelEdit(row: Level, index: number) {
    if (row.statusName === '' && row.id === 0) {
      this.rows.splice(index, 1);
    } else {
      row.isEditing = false;
    }
    this.currentlyEditingIndex = -1;
    this.getAllStatus();
  }

  deleteRow(id: number) {
    if (id) {
      from(this.statusService.deleteStatus(id)).subscribe(
        response => {
          this.triggerToast("Deleted", "Status deleted successfully", "danger");
          this.getAllStatus();
          if (this.currentPage > 1 && this.paginatedRows.length === 0) {
            this.currentPage--;
          }
        },
        (error) => {
          if (error.status === 400) {
            this.triggerToast("Error", "Bad request. Please check your input.", "warning");
          } else if (error.status === 404) {
            this.triggerToast("Error", "Status not found. It might have been already deleted.", "warning");
          } else if (error.status === 500) {
            this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
          } else {
            this.triggerToast("Error", "An unexpected error occurred.", "danger");
          }
          this.getAllStatus();
        }
      );
    } else {
      if (this.currentPage > 1 && this.paginatedRows.length === 0) {
        this.currentPage--;
      }
    }
  }

  saveToApi(row: Level) {
    const payload = { statusName: row.statusName };
    this.statusService.saveStatus(payload).subscribe(
      response => {
        this.triggerToast("Created", "Status created successfully", "success");
        this.getAllStatus();
      },
      (error) => {
        if (error.status === 400) {
          this.triggerToast("Error", "Bad request. Please check your input.", "warning");
        } else if (error.status === 404) {
          this.triggerToast("Error", "Status not found. It might have been already deleted.", "warning");
        } else if (error.status === 500) {
          this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
        } else {
          this.triggerToast("Error", "An unexpected error occurred.", "danger");
        }
        this.getAllStatus();
      }
    );
  }

  updateToApi(row: Level) {
    const payload = {
      id: row.id,
      statusName: row.statusName,
    };
    this.statusService.updateStatus(payload).subscribe(
      response => {
        this.triggerToast("Updated", "Status updated successfully", "warning");
        this.getAllStatus();
      },
      (error) => {
        if (error.status === 400) {
          this.triggerToast("Error", "Bad request. Please check your input.", "warning");
        } else if (error.status === 404) {
          this.triggerToast("Error", "Status not found. It might have been already deleted.", "warning");
        } else if (error.status === 500) {
          this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
        } else {
          this.triggerToast("Error", "An unexpected error occurred.", "danger");
        }
        this.getAllStatus();
      }
    );
  }

  get paginatedRows() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.rows.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }


  triggerToast(header: any, body: any, mess: any) {
    this.toastMessageComponent.showToast(header, body, mess);
  }

}
