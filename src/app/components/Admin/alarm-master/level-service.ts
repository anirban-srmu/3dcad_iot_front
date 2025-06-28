import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { Config } from 'src/app/configuration/env.config';


export interface Alaram {
  id: number;
  AlaramCode: string;
  AlaramMessage: string;
  isEditing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LevelService {
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
  getAllLevels(page: number, size: number): Observable<Alaram[]> {
    return this.http.get<Alaram[]>(`${this.BaseEndpoint}AlaramMaster`, { headers: this.reqHeader });
  }

  // GET level by ID
  getLevelById(id: number): Observable<Alaram> {
    return this.http.get<Alaram>(`${this.BaseEndpoint}AlaramMaster/${id}`, { headers: this.reqHeader });
  }

  // POST to create a new level
  saveLevel(Alaram: any): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}AlaramMaster`, Alaram, { headers: this.reqHeader });
  }

  // POST to update an existing level
  updateLevel(Alaram: any): Observable<any> {
    return this.http.post(`${this.BaseEndpoint}AlaramMaster`, Alaram, { headers: this.reqHeader });
  }

  // DELETE a level by ID
  deleteLevel(id: number): Observable<any> {

    return this.http.post(`${this.BaseEndpoint}levelmaster/${id}` ,{ headers: this.reqHeader });
  }

}
