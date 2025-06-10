import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { Config } from 'src/app/configuration/env.config';

interface Level {
  id?: number;
  levelName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  BaseEndpoint: any;
  isLoggedIn = false;
  reqHeader: HttpHeaders;

  constructor(private http: HttpClient,private cookieService: CookieService) {
    this.BaseEndpoint = Config.BaseEndpoint;
   // const token = sessionStorage.getItem('accessToken'); // Fetch the token from session storage
    this.reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'Authorization': `Bearer ${token}` // Use backticks for string interpolation
    });
  }

  // GET all levels
  getAllLevels(page: number, size: number): Observable<Level[]> {
    return this.http.get<Level[]>(`${this.BaseEndpoint}levelmaster/getAll?page=${page}&size=${size}`, { headers: this.reqHeader });
  }

  // GET level by ID
  getLevelById(id: number): Observable<Level> {
    return this.http.get<Level>(`${this.BaseEndpoint}levelmaster/getById/${id}`, { headers: this.reqHeader });
  }

  // POST to create a new level
  saveLevel(level: Level): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}levelmaster/save`, level, { headers: this.reqHeader });
  }

  // POST to update an existing level
  updateLevel(level: Level): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}levelmaster/update`, level, { headers: this.reqHeader });
  }

  // DELETE a level by ID
  deleteLevel(id: number): Observable<any> {
    const payload={ id:id}
    return this.http.post(`${this.BaseEndpoint}levelmaster/delete`, payload ,{ headers: this.reqHeader });
  }


}
