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

    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router, private secretCodeService: SecretCodeService) {

    }
    nonceforlogin: any;
    login(data: any) {
        return this.http.post(this.BaseEndpoint + 'user/login', data)
            .toPromise()
            .then((response: any) => {
                this.tokenKey = response.token;
                this.isLoggedIn = true;
                return response;
            })
            .catch((error) => {
                console.error('Login failed', error);
                return Promise.reject(error);
            });
    }

    logout(): Promise<any> {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            return Promise.reject('No access token found');
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http.post(
            `${this.BaseEndpoint}logout?token=` + token,  
            {}, 
            { headers }
        ).toPromise()
            .then((response: any) => {
                sessionStorage.removeItem('accessToken');


                return response;  
            })
            .catch(error => {
                sessionStorage.removeItem('accessToken');
                return Promise.reject(error);
            });
    }

    loginWithRfid(rfidTag: string): Promise<any> {
        return this.http.post<any>(`${this.BaseEndpoint}/auth/rfid-login`, { rfidTag }).toPromise();
    }
}

