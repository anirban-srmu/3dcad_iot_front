import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { SafePipe } from 'src/app/safe.pipe';
import { ToastMessageComponent } from 'src/app/toast-message/toast-message.component';

import { from } from 'rxjs';
import { LevelService } from './level-service';


export interface Alaram {
  id: number;
  AlaramCode: string;
  AlaramMessage: string;
  isEditing?: boolean;
}

@Component({
  selector: 'app-alarm-master',
  standalone: true,
  imports: [ SharedModule,NgSelectModule, ToastMessageComponent, SafePipe],
  templateUrl: './alarm-master.component.html',
  styleUrl: './alarm-master.component.scss'
})
export class AlarmMasterComponent {

  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;

  showModal: boolean = false;
  newlevelName: string = '';
  itemsPerPage: number = 10;
  rows: Alaram[] = [];
  currentlyEditingIndex: number = -1;
  tableFlag: boolean = false;
  selectedAttribute: any;
  pageSize = 5;
  currentPage = 1;
  constructor(private levelService: LevelService) { }
 ngOnInit(): void {
     this.getAllAlarms();
   }
 
   getAllAlarms(page: number = 0): void {
     this.levelService.getAllLevels(page, this.itemsPerPage).subscribe({
       next: (response: any) => {
         this.rows = response.content.map((item: any) => ({
           id: item.id,
           AlaramCode: item.alarmCode || '',
           AlaramMessage: item.alarmMessage || '',
           isEditing: false
         })).sort((a: any, b: any) => b.id - a.id);
       },
       error: (err) => {
         console.error('Failed to load alarms', err);
       }
     });
   }
 
   addRow() {
     if (this.currentlyEditingIndex === -1) {
       this.rows.unshift({
         id: 0,
         AlaramCode: '',
         AlaramMessage: '',
         isEditing: true
       });
       this.currentlyEditingIndex = 0;
       this.currentPage = 1;
     }
   }
 
   editRow(row: Alaram) {
     if (this.currentlyEditingIndex === -1) {
       this.currentlyEditingIndex = this.rows.indexOf(row);
       row.isEditing = true;
     }
   }
 
   saveRow(row: Alaram) {
     if (row.AlaramCode === '' || row.AlaramMessage === '') {
       this.triggerToast("Error", "Please fill all fields", "danger");
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
 
   cancelEdit(row: Alaram, index: number) {
     if ((row.AlaramCode === '' || row.AlaramMessage === '') && row.id === 0) {
       this.rows.splice(index, 1);
     } else {
       row.isEditing = false;
     }
     this.currentlyEditingIndex = -1;
   }
 
   deleteRow(alarmId: number) {
     if (alarmId) {
       from(this.levelService.deleteLevel(alarmId)).subscribe(
         (response) => {
           this.triggerToast("Deleted", "Alarm deleted successfully", "danger");
           if (this.currentPage > 1 && this.paginatedRows.length === 0) {
             this.currentPage--;
           }
           this.getAllAlarms();
         },
         (error) => {
           this.handleError(error);
           this.getAllAlarms();
         }
       );
     } else {
       if (this.currentPage > 1 && this.paginatedRows.length === 0) {
         this.currentPage--;
       }
     }
   }
 
   sanitizeInput(row: Alaram): void {
     const disallowedCharacters = /[^a-zA-Z0-9\s]/g;
     if (disallowedCharacters.test(row.AlaramCode) || disallowedCharacters.test(row.AlaramMessage)) {
       this.triggerToast("Error", "Please Enter Valid Input", "danger");
     }
     row.AlaramCode = row.AlaramCode.replace(disallowedCharacters, '');
     row.AlaramMessage = row.AlaramMessage.replace(disallowedCharacters, '');
   }
 
   saveToApi(row: Alaram) {
     const payload = { 
       alarmCode: row.AlaramCode,
       alarmMessage: row.AlaramMessage
     };
     this.levelService.saveLevel(payload).subscribe(
       response => {
         this.triggerToast("Created", "Alarm created successfully", "success");
         this.getAllAlarms();
       },
       (error) => {
         this.handleError(error);
         this.getAllAlarms();
       }
     );
   }
 
   updateToApi(row: Alaram) {
     const payload = {
       id: row.id,
       alarmCode: row.AlaramCode,
       alarmMessage: row.AlaramMessage
     };
     this.levelService.updateLevel(payload).subscribe(
       response => {
         this.triggerToast("Updated", "Alarm updated successfully", "warning");
         this.getAllAlarms();
       },
       (error) => {
         this.handleError(error);
         this.getAllAlarms();
       }
     );
   }
 
   private handleError(error: any) {
     if (error.status === 400) {
       const errorMessage = error.error?.message || "Invalid request format.";
       this.triggerToast("Error", errorMessage, "danger");
     } else if (error.status === 404) {
       this.triggerToast("Error", "Alarm not found. It might have been already deleted.", "warning");
     } else if (error.status === 500) {
       this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
     } else {
       const unexpectedMessage = error.error?.message || "An unexpected error occurred.";
       this.triggerToast("Error", unexpectedMessage, "danger");
     }
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
