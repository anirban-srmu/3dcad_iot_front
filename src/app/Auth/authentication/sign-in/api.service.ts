// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Config } from 'src/app/configuration/env.config';
import { SecretCodeService } from 'src/app/shared/SecretCodeService';
import { DevToolsDetectionService } from 'src/app/shared/configuration/DevToolsDetectionService';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private nonce: string | null = null;
    BaseEndpoint: any = Config.BaseEndpoint;
    isLoggedIn = false;
    private tokenKey: string | null = null;
    private reqHeader!: HttpHeaders;

    constructor(private http: HttpClient, private cookieService: CookieService,private router: Router,private secretCodeService: SecretCodeService) {
       
    }
nonceforlogin:any;
login(data: any) {
    return this.http.post(this.BaseEndpoint + 'login', data)
    .toPromise()
    .then((response: any) => {
      // If the login is successful, store the access token
      this.tokenKey = response.token;
      this.isLoggedIn=true;
      return response;
    })
    .catch((error) => {
      // Handle any errors, possibly due to authentication failure
      console.error('Login failed', error);
      return Promise.reject(error);
    });
  }

  logout(): Promise<any> {
    // 1. Get token (early return if missing)
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
        return Promise.reject('No access token found');
    }

    // 2. Set headers (with Authorization)
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });

    // 3. Make API call (using proper URL encoding)
    return this.http.post(
        `${this.BaseEndpoint}logout?token=`+token,  // Remove token from URL
        {},  // Empty body
        { headers }
    ).toPromise()
    .then((response: any) => {
        // 4. Clear local storage AFTER successful API call
        sessionStorage.removeItem('accessToken');

        
        return response;  // Return API response
    })
    .catch(error => {
        // 5. Still clear storage even if API fails
        sessionStorage.removeItem('accessToken');
        return Promise.reject(error);
    });
}


}

  