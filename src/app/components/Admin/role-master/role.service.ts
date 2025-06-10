import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'src/app/configuration/env.config';

interface Role {
  id?: number;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
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

  // GET all roles
  getAllRoles(page: number, size: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.BaseEndpoint}role/getAll?page=${page}&size=${50}`, { headers: this.reqHeader });
  }

  // GET role by ID
  getRoleById(id: number): Observable<Role> {
    const payload={id:id}
    return this.http.post<Role>(`${this.BaseEndpoint}role/getById`, payload,{ headers: this.reqHeader });
  }

  // POST to create a new role
  saveRole(role: Role): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}role/save`, role, { headers: this.reqHeader });
  }

  // POST to update an existing role
  updateRole(role: Role): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}role/update`, role, { headers: this.reqHeader });
  }

  // DELETE a role by ID
  deleteRole(id: number): Observable<any> {
    const payload={id:id}
    return this.http.post(`${this.BaseEndpoint}role/delete`,payload, { headers: this.reqHeader });
  }
}
