import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'src/app/configuration/env.config';



export interface User {
  id: number;     // Role ID
  username: string;   // Role Name
  firstName: string; 
  lastName: string; 
  emailId: string; 
   password: string; 
  roleId:number;
  roleName:String;
  isEditing?: boolean; // Optional property to track editing state
  isRoleDropdownOpen?: boolean; // add this property
  selectedRole?: string; // add this property
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  BaseEndpoint: any;
  isLoggedIn = false;
  reqHeader: HttpHeaders;

  constructor(private http: HttpClient) {
    this.BaseEndpoint = Config.BaseEndpoint;
    const token = sessionStorage.getItem('accessToken'); // Fetch the token from session storage
    this.reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}` // Use backticks for string interpolation
    });
  }

  // GET all levels
  getAllUsers(page: number, size: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.BaseEndpoint}user/getAll?page=${page}&size=${size}`, { headers: this.reqHeader });
  }

  // GET level by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.BaseEndpoint}user/getById/${id}`, { headers: this.reqHeader });
  }

  // POST to create a new level
  saveUser(user: User): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}user/save`, user, { headers: this.reqHeader });
  }

  // POST to update an existing level
  updateUser(user: User): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}user/update`, user, { headers: this.reqHeader });
  }

  // DELETE a level by ID
  deleteUser(id: number): Observable<any> {
    const data={
      id:id
    }
    return this.http.post(`${this.BaseEndpoint}user/delete`, data, { headers: this.reqHeader });
  }
}
