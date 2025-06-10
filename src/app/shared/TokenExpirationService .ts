import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService {
  private tokenCheckSubscription: Subscription;

  constructor(private router: Router) {
    // Check for token expiration every 5 seconds
    this.tokenCheckSubscription = interval(5000).subscribe(() => this.checkTokenExpiration());
  }

  private checkTokenExpiration(): void {
    const userDetails = sessionStorage.getItem('userDetail');
    if (userDetails) {
      const userDetail = JSON.parse(userDetails);
      const token = userDetail.accessToken;
      if (token && this.isTokenExpired(token)) {
        console.warn("Token has expired. Automatically redirecting to login.");
        this.navigateToSignIn();
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.exp < currentTime; // Return true if token is expired
    }
    return false;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]; // Get the payload part of the token
      return JSON.parse(atob(payload)); // Decode and return the payload as JSON
    } catch (error) {
      // console.error('Error decoding token:', error);
      return null;
    }
  }

  private navigateToSignIn(): void {
    this.router.navigate(['auth/signin']);
    sessionStorage.clear();
  }

  // Clean up the subscription
  ngOnDestroy() {
    if (this.tokenCheckSubscription) {
      this.tokenCheckSubscription.unsubscribe();
    }
  }
}
