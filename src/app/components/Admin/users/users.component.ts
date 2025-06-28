import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ToastMessageComponent } from 'src/app/toast-message/toast-message.component';
import { UserService } from './user-service';
import { from } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import bootstrap, { Modal } from 'bootstrap';
import { AppModule } from 'src/app/app.module';
import { CommonModule } from '@angular/common';
import { EncryptionService } from 'src/app/shared/configuration/EncryptionService';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ApiService } from 'src/app/Auth/authentication/sign-in/api.service';

export interface User {
  id: number;     // Role ID
  username: string;   // Role Name
  firstname: string;
  lastname: string;
  roleid: number;
  roleName: String;
  password: string;
  isEditing?: boolean; // Optional property to track editing state
  isRoleDropdownOpen?: boolean; // add this property
  role?: string; // add this property
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, ToastMessageComponent, CommonModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;
  @ViewChild('changePasswordModal', { static: true }) changePasswordModal!: ElementRef;
  passwordForm: FormGroup;
  changePasswordrow: any;
  private modalInstance!: Modal; // Store the modal instance

  showModal: boolean = false;
  newuserName: string = '';
  itemsPerPage: number = 10;

  rows: User[] = [];
  currentlyEditingIndex: number = -1;
  tableFlag: boolean = false;
  selectedAttribute: any;

  pageSize = 5;
  currentPage = 1;

  constructor(private apiService: ApiService, private userService: UserService, private fb: FormBuilder, private readonly encryptionService: EncryptionService) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    //   this.getAllRoles();
    // this.getAllStores();
    this.paginatedRows.forEach(user => {
      user.isRoleDropdownOpen = false;
      user.role = '';
    });
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
next: (response: any) => {
    if (!response || !Array.isArray(response)) {
        console.error('Invalid response format');
        this.rows = [];
        return;
    }

    this.rows = response.map(row => {
        try {
            const roleId = row.roleid || this.getRoleId(row.roleName);
            const roleName = row.roleName || this.getRoleName(row.roleid);
            
            return {
                ...row,
                roleid: roleId,
                roleName: roleName,
                role: roleName
            };
        } catch (error) {
            console.error('Error processing row:', row, error);
            return {
                ...row,
                roleId: row.roleId || -1,
                roleName: row.roleName || 'Unknown Role'
            };
        }
    });
}
,
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  staticRoles = [
    { roleid: 1, roleName: 'Admin' },
    { roleid: 2, roleName: 'Engineer' }

  ];

  getRoleName(roleId: Number): string {
    const role = this.staticRoles.find(r => r.roleid === roleId);
    return role ? role.roleName : 'Unknown Role';
  }
getRoleId(roleName: string): number {
    const role = this.staticRoles.find(r => r.roleName === roleName);
    return role ? role.roleid : -1; // Return -1 or null if role not found
}

  addRow() {
    if (this.currentlyEditingIndex === -1) {
      this.rows.unshift({
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        roleid: 0,
        roleName: '',
        isEditing: true,
        isRoleDropdownOpen: false,
        role: '',
        id: 0
      });
      this.currentlyEditingIndex = 0;
      this.currentPage = 1;
    }
  }

  editRow(row: User) {
    if (this.currentlyEditingIndex === -1) {
      this.currentlyEditingIndex = this.rows.indexOf(row);
      row.isEditing = true;
    }
  }

  saveRow(row: User) {
    if (row.username === '') {
      this.triggerToast("Error", "UserName cannot be empty", "danger");
      return;
    } else if (row.roleid === 0) {
      this.triggerToast("Error", "Role must be selected", "danger");
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
  cancelEdit(row: User, index: number) {
    if (row.username === '' && row.id === 0) {
      this.rows.splice(index, 1);
    } else {
      row.isEditing = false;
    }
    this.currentlyEditingIndex = -1;
  }
  deleteRow(id: number) {
    if (id) {
      from(this.userService.deleteUser(id)).subscribe(
        response => {
          this.triggerToast("Deleted", "User deleted successfully", "danger");
          this.getAllUsers();
          if (this.currentPage > 1 && this.paginatedRows.length === 0) {
            this.currentPage--;
          }
        },
        error => {
          console.error('Error deleting role:', error);
        }
      );
    } else {
      if (this.currentPage > 1 && this.paginatedRows.length === 0) {
        this.currentPage--;
      }
    }
  }

  sanitizeInput(row: any, field: string): void {
    // Regex to allow only underscores and alphanumeric characters
    const allowedCharacters = /^[\w_]*$/; // \w includes [a-zA-Z0-9]



    // Regex for email validation

    // Only process specific fields
    if (['firstName', 'lastName', 'username'].includes(field)) {
      // Check if the input contains disallowed characters
      if (!allowedCharacters.test(row[field])) {
        // Trigger toast message for invalid input
        this.triggerToast('Error', `Invalid characters in ${field}. Only letters, numbers, and underscores are allowed.`, 'danger');
        // Remove disallowed characters by retaining only allowed characters
        row[field] = row[field].replace(/[^a-zA-Z0-9_]/g, '');
      }
    }
  }


  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  saveToApi(row: User) {
    const payload={
    firstname: row.firstname,
    lastname: row.lastname,
    username: row.username,
    password: row.password,
    role: row.roleName
    }
    this.userService.saveUser(payload).subscribe(
      response => {
        //console.log('User created successfully:', response);
        this.triggerToast("Created", "User created successfully", "success");
        this.getAllUsers();
      },
      error => {
        if (error.status === 409) {
          this.triggerToast("Error", "User or Email already Exists", "warning");
        } else if (error.status === 404) {
          this.triggerToast("Error", "Role not found. It might have been already deleted.", "warning");
        } else if (error.status === 500) {
          this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
        } else {
          this.triggerToast("Error", "An unexpected error occurred.", "danger");
        }
        // this.getAllUsers();

      }
    );


  }

  updateToApi(row: User) {
    this.userService.updateUser(row).subscribe(
      response => {
        //console.log('User updated successfully:', response);
        this.triggerToast("Updated", "User updated successfully", "warning");
        this.getAllUsers();
      },
      error => {
        if (error.status === 400) {
          this.triggerToast("Error", "Bad request. Please check your input.", "warning");
        } else if (error.status === 404) {
          this.triggerToast("Error", "Role not found. It might have been already deleted.", "warning");
        } else if (error.status === 500) {
          this.triggerToast("Error", "Server error occurred. Please try again later.", "danger");
        } else {
          this.triggerToast("Error", "An unexpected error occurred.", "danger");
        }
        // this.getAllUsers();
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


  filteredRoles = this.staticRoles;


  filterRoles(row: any, searchTerm: string) {
    this.filteredRoles = this.staticRoles.filter((role: { roleName: string; }) =>
      role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    row.isRoleDropdownOpen = true;
  }

  onFilterRoles(row: User, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    this.filterRoles(row, inputValue);
  }

  selectRole(row: any, event: Event) {

    //console.log("role",event,"row",row);
    const inputElement = event.target as HTMLInputElement;
    row.roleid = Number(inputElement.value);

    row.rolename = this.getRoleName(Number(inputElement.value));
    row.isRoleDropdownOpen = false;
  }


  selectStore(row: any, event: Event) {

    //console.log("role",event,"row",row);
    const inputElement = event.target as HTMLInputElement;
    row.storeid = Number(inputElement.value);
    row.isRoleDropdownOpen = false;
  }

  triggerToast(header: any, body: any, mess: any) {
    this.toastMessageComponent.showToast(header, body, mess);
  }

  openChangePasswordModal(row: any): void {
    this.changePasswordrow = row;

    const modalElement = this.changePasswordModal.nativeElement;
    this.modalInstance = new Modal(modalElement); // Initialize modal instance
    this.modalInstance.show();
  }

}




