import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleService } from './role.service';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { ToastMessageComponent } from 'src/app/toast-message/toast-message.component';

export interface Role {
  roleid: number;
  roleName: string;
  isEditing?: boolean;
}

@Component({
  selector: 'app-role-master',
  standalone: true,
  imports: [SharedModule, NgSelectModule, FormsModule, ToastMessageComponent],
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.scss']
})
export class RoleMasterComponent implements OnInit {

  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;
  showModal: boolean = false;
  newRoleName: string = '';
  itemsPerPage: number = 10;
  rows: Role[] = [];
  currentlyEditingIndex: number = -1;
  tableFlag: boolean = false;
  selectedAttribute: any;
  pageSize = 5;
  currentPage = 1;
  constructor(private roleService: RoleService) { }
  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles(page: number = 0): void {
    this.roleService.getAllRoles(page, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.rows = response.content.sort((a: any, b: any) => b.roleid - a.roleid);
      },
      error: (err) => {
        console.error('Failed to load roles', err);
      }
    });
  }

  addRow() {
    if (this.currentlyEditingIndex === -1) {
      this.rows.unshift({
        roleName: '',
        isEditing: true,
        roleid: 0
      });
      this.currentlyEditingIndex = 0;
      this.currentPage = 1;
    }
  }

  editRow(row: Role) {
    if (this.currentlyEditingIndex === -1) {
      this.currentlyEditingIndex = this.rows.indexOf(row);
      row.isEditing = true;
    }
  }

  saveRow(row: Role) {
    if (row.roleName === '') {
      return;
    }

    row.isEditing = false;
    this.currentlyEditingIndex = -1;

    if (row.roleid) {
      this.updateToApi(row);
    } else {
      this.saveToApi(row);
    }
  }
  cancelEdit(row: Role, index: number) {
    if (row.roleName === '' && row.roleid === 0) {
      this.rows.splice(index, 1);
    } else {
      row.isEditing = false;
    }
    this.currentlyEditingIndex = -1;
    this.getAllRoles();
  }

  
  sanitizeInput(row: any): void {
    const disallowedCharacters = /[^a-zA-Z0-9\s]/g;  
    if (disallowedCharacters.test(row.roleName)) {
      this.triggerToast("Error", "Please Enter Valid Input", "danger");
    }
    row.roleName = row.roleName.replace(disallowedCharacters, '');
  }

  deleteRow(roleid: number) {

    if (roleid) {
      from(this.roleService.deleteRole(roleid)).subscribe(
        response => {
          this.triggerToast("Deleted", "Role deleted successfully", "danger");
          this.getAllRoles();
          if (this.currentPage > 1 && this.paginatedRows.length === 0) {
            this.currentPage--;
          }
        },
        (error) => {
          if (error.status === 400) {
            this.triggerToast("Error", "Bad request. Please check your input.", "warning");
          } else if (error.status === 404) {
            this.triggerToast("Error", "Role not found. It might have been already deleted.", "warning");
          } else if (error.status === 500) {
            this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
          } else {
            this.triggerToast("Error", "An unexpected error occurred.", "danger");
          }
          this.getAllRoles();
        }
      );
    } else {
      if (this.currentPage > 1 && this.paginatedRows.length === 0) {
        this.currentPage--;
      }
    }
  }

  saveToApi(row: Role) {
    const payload = { roleName: row.roleName };
    this.roleService.saveRole(payload).subscribe(
      response => {
        this.triggerToast("Created", "Role created successfully", "success");
        this.getAllRoles();
      },
      (error) => {
        if (error.status === 400) {
          this.triggerToast("Error", "Bad request. Please check your input.", "warning");
        } else if (error.status === 404) {
          this.triggerToast("Error", "Role not found. It might have been already deleted.", "warning");
        } else if (error.status === 500) {
          this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
        } else {
          this.triggerToast("Error", "An unexpected error occurred.", "danger");
        }
        this.getAllRoles();
      }
    );
  }

  updateToApi(row: Role) {
    const payload = {
      roleid: row.roleid,
      roleName: row.roleName,
    };
    this.roleService.updateRole(payload).subscribe(
      response => {
        this.triggerToast("Updated", "Role updated successfully", "warning");
        this.getAllRoles();
      },
      (error) => {
        if (error.status === 400) {
          this.triggerToast("Error", "Bad request. Please check your input.", "warning");
        } else if (error.status === 404) {
          this.triggerToast("Error", "Role not found. It might have been already deleted.", "warning");
        } else if (error.status === 500) {
          this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
        } else {
          this.triggerToast("Error", "An unexpected error occurred.", "danger");
        }
        this.getAllRoles();
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
