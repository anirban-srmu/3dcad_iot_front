import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ToastMessageComponent } from 'src/app/toast-message/toast-message.component';
import { UserService } from './user-service';
import { from } from 'rxjs';
import { RoleService } from '../role-master/role.service';
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
  firstName: string; 
  lastName: string; 
  emailId: string; 
  active:boolean;
  roleId:number;
  roleName:String;
  storeId : 0,
  storeName:'',
  password: string; 
  isEditing?: boolean; // Optional property to track editing state
  isRoleDropdownOpen?: boolean; // add this property
  selectedRole?: string; // add this property
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule,ToastMessageComponent,SharedModule,CommonModule],
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
  roles: any[]=[];
  stores: any[]=[];

  constructor(private apiService: ApiService,private userService: UserService,private fb: FormBuilder,private roleService:RoleService,private readonly encryptionService:EncryptionService) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllRoles();
   // this.getAllStores();
    this.paginatedRows.forEach(user => {
      user.isRoleDropdownOpen = false;
      user.selectedRole = '';
    });
  }

  getAllUsers(page: number = 0): void {
    this.userService.getAllUsers(page, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.rows = response.map((user: any) => ({
          ...user,
          emailId: this.encryptionService.decrypt(user.emailId),
        })).sort((a: any, b: any) => b.id - a.id);
  
        //console.log("Users with decrypted emails:", this.rows);
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }
  
  getAllRoles(page: number = 0): void {
    this.roleService.getAllRoles(page, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.roles = response.content.sort((a: any, b: any) => b.roleid - a.roleid);
        //console.log("Roles sorted by latest roleid:", this.rows);
      },
      error: (err) => {
        console.error('Failed to load roles', err);
      }
    });
  }
  // getAllStores(page: number = 0): void {
  //   this.storeService.getAllStores(page, this.itemsPerPage).subscribe({
  //     next: (response: any) => {
  //       this.stores = response.sort((a: any, b: any) => b.id - a.id);
  //       //console.log("Stores sorted by latest id:", this.stores);
  //     },
  //     error: (err: any) => {
  //       console.error('Failed to load roles', err);
  //     }
  //   });
  // }

  addRow() {
    if (this.currentlyEditingIndex === -1) {
      this.rows.unshift({
        username: '',
        firstName: '',
        lastName: '',
        active:true,
        emailId: '',
           password: '',
        roleId: 0,    
          roleName: '' ,
          storeId : 0,
          storeName:'', 
        isEditing: true,
        isRoleDropdownOpen: false, 
        selectedRole: '',          
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
    } else if (row.emailId === '') {
      this.triggerToast("Error", "Email cannot be empty", "danger");
      return;
    } else if (row.roleId === 0) {
      this.triggerToast("Error", "Role must be selected", "danger");
      return;
    } else if (row.storeId === 0) {
      this.triggerToast("Error", "Store must be selected", "danger");
      return;
    }
    
    const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i; // Case-insensitive
    const specificDomainRegex = /^[^\s@]+@titan\.co\.in$/i;  // Case-insensitive
    
    if (!generalEmailRegex.test(row.emailId)) {
      this.triggerToast("Error", "Invalid Email Format", "danger");
      return;
    }

 



    // if (!specificDomainRegex.test(row.emailId)) {
    //   this.triggerToast("Error", "Email must belong to the titan.co.in domain", "danger");
    //   return;
    // }
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
          this.triggerToast("Deleted", "User deleted successfully","danger");
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
      this.userService.saveUser(row).subscribe(
        response => {
          //console.log('User created successfully:', response);
          this.triggerToast("Created", "User created successfully","success");
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
        this.triggerToast("Updated", "User updated successfully","warning");
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

 
  filteredRoles = this.roles;


  filterRoles(row: any, searchTerm: string) {
    this.filteredRoles = this.roles.filter((role: { roleName: string; }) => 
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
   row.roleId=Number(inputElement.value);
    row.isRoleDropdownOpen = false; 
  }

  
  selectStore(row: any, event: Event) {

    //console.log("role",event,"row",row);
    const inputElement = event.target as HTMLInputElement;
   row.storeid=Number(inputElement.value);
    row.isRoleDropdownOpen = false; 
  }

  triggerToast(header: any, body: any,mess:any) {
    this.toastMessageComponent.showToast(header, body,mess);
  }


  openChangePasswordModal(row: any): void {
    this.changePasswordrow = row;

    const modalElement = this.changePasswordModal.nativeElement;
    this.modalInstance = new Modal(modalElement); // Initialize modal instance
    this.modalInstance.show();
  }


}




