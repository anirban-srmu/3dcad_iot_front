import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/layout/shared/shared.module';

import { from } from 'rxjs';
import { LevelService } from './level-service';
import { ToastMessageComponent } from 'src/app/toast-message/toast-message.component';
import { SafePipe } from 'src/app/safe.pipe';

export interface Level {
  id: number;
  levelName: string;
  isEditing?: boolean;
}

@Component({
  selector: 'app-level-master',
  standalone: true,
  imports: [SharedModule, NgSelectModule, ToastMessageComponent, SafePipe],
  templateUrl: './level-master.component.html',
  styleUrls: ['./level-master.component.scss']

})
export class LevelMasterComponent {

  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;

  showModal: boolean = false;
  newlevelName: string = '';
  itemsPerPage: number = 10;
  rows: Level[] = [];
  currentlyEditingIndex: number = -1;
  tableFlag: boolean = false;
  selectedAttribute: any;
  pageSize = 5;
  currentPage = 1;
  constructor(private levelService: LevelService) { }
  ngOnInit(): void {
    this.getAllLevles();
  }

  getAllLevles(page: number = 0): void {
    this.levelService.getAllLevels(page, this.itemsPerPage).subscribe({
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
        levelName: '',
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
    if (row.levelName === '') {
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

  cancelEdit(row: Level, index: number) {
    if (row.levelName === '' && row.id === 0) {
      this.rows.splice(index, 1);
    } else {
      row.isEditing = false;
    }
    this.currentlyEditingIndex = -1;
  }


  deleteRow(levelid: number) {
    if (levelid) {
      from(this.levelService.deleteLevel(levelid)).subscribe(
        (response) => {
          this.triggerToast("Deleted", "Level deleted successfully", "danger");
         
          if (this.currentPage > 1 && this.paginatedRows.length === 0) {
            this.currentPage--;
          }
          this.getAllLevles();
        },
        (error) => {
          if (error.status === 400) {
            // Check if a message exists in the response body
            const errorMessage = error.error?.message || "Invalid request format.";
            this.triggerToast("Error", errorMessage, "danger");
          } else if (error.status === 404) {
            this.triggerToast("Error", "Level not found. It might have been already deleted.", "warning");
          } else if (error.status === 500) {
            this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
          } else {
            const unexpectedMessage = error.error?.message || "An unexpected error occurred.";
            this.triggerToast("Error", unexpectedMessage, "danger");
          }
          this.getAllLevles();
        }
      );
    } else {
      if (this.currentPage > 1 && this.paginatedRows.length === 0) {
        this.currentPage--;
      }
    }
  }

  sanitizeInput(row: any): void {
    const disallowedCharacters = /[^a-zA-Z0-9\s]/g;  
    if (disallowedCharacters.test(row.levelName)) {
      this.triggerToast("Error", "Please Enter Valid Input", "danger");
    }
    row.levelName = row.levelName.replace(disallowedCharacters, '');
  }
  saveToApi(row: Level) {
    const payload = { levelName: row.levelName };
    this.levelService.saveLevel(payload).subscribe(
      response => {
        this.triggerToast("Created", "Level created successfully", "success");
        this.getAllLevles();
      },
      (error) => {
        if (error.status === 400) {
          // Check if a message exists in the response body
          const errorMessage = error.error?.message || "Invalid request format.";
          this.triggerToast("Error", errorMessage, "danger");
        } else if (error.status === 404) {
          this.triggerToast("Error", "Level not found. It might have been already deleted.", "warning");
        } else if (error.status === 500) {
          this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
        } else {
          const unexpectedMessage = error.error?.message || "An unexpected error occurred.";
          this.triggerToast("Error", unexpectedMessage, "danger");
        }
        this.getAllLevles();
      }
    );
  }

  updateToApi(row: Level) {
    const payload = {
      id: row.id,
      levelName: row.levelName,
    };
    this.levelService.updateLevel(payload).subscribe(
      response => {
        this.triggerToast("Updated", "Level updated successfully", "warning");
        this.getAllLevles();
      },
      (error) => {
        if (error.status === 400) {
          // Check if a message exists in the response body
          const errorMessage = error.error?.message || "Invalid request format.";
          this.triggerToast("Error", errorMessage, "danger");
        } else if (error.status === 404) {
          this.triggerToast("Error", "Level not found. It might have been already deleted.", "warning");
        } else if (error.status === 500) {
          this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
        } else {
          const unexpectedMessage = error.error?.message || "An unexpected error occurred.";
          this.triggerToast("Error", unexpectedMessage, "danger");
        }
        this.getAllLevles();
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
