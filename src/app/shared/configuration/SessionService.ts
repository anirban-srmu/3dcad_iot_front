// session.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly TOKEN_KEY = 'jwt'; // Key for storing the JWT token
  private readonly SESSION_KEY = 'sessionStatus'; // Key for session status

  constructor() {}

  // Set the session token
  setSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.SESSION_KEY, 'true'); // Set session status to true
  }

  // Get the session token
  getSession(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if the session is valid
  isSessionValid(): boolean {
    return localStorage.getItem(this.SESSION_KEY) === 'true';
  }

  // Clear the session
  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }
}