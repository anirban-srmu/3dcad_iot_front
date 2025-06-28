import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'src/app/configuration/env.config';





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
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BaseEndpoint}users`, { headers: this.reqHeader });
  }

  // GET level by ID
  getUserById(username: any): Observable<any> {
    return this.http.get<any>(`${this.BaseEndpoint}user/${username}`, { headers: this.reqHeader });
  }

  // POST to create a new level
  saveUser(user: any): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}users/`, user, { headers: this.reqHeader });
  }

  // POST to update an existing level
  updateUser(user: any): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}users/${user.username}`, user, { headers: this.reqHeader });
  }

  // DELETE a level by ID
  deleteUser(id: number): Observable<any> {
    const data={
      id:id
    }
    return this.http.post(`${this.BaseEndpoint}user/delete`, data, { headers: this.reqHeader });
  }
}
