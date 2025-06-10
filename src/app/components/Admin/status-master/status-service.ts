import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'src/app/configuration/env.config';

interface Status {
  id?: number;
  statusName: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatusService {
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
  getAllStatus(page: number, size: number): Observable<Status[]> {
    return this.http.get<Status[]>(`${this.BaseEndpoint}statusmaster/getAll?page=${page}&size=${size}`, { headers: this.reqHeader });
  }

  // GET level by ID
  getStatusById(id: number): Observable<Status> {
    const payload={id:id}
    return this.http.post<Status>(`${this.BaseEndpoint}statusmaster/getById`, payload,{ headers: this.reqHeader });
  }

  // POST to create a new level
  saveStatus(status: Status): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}statusmaster/save`, status, { headers: this.reqHeader });
  }

  // POST to update an existing level
  updateStatus(level: Status): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}statusmaster/update`, level, { headers: this.reqHeader });
  }

  // DELETE a level by ID
  deleteStatus(id: number): Observable<any> {
    const payload={id:id}
    return this.http.post(`${this.BaseEndpoint}statusmaster/delete`,payload, { headers: this.reqHeader });
  }
}
