// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class TokenService {
//   private token: string | null = null; // In-memory token storage

//   constructor() {
//     // On service initialization, synchronize the in-memory token with localStorage
//     const storedToken = localStorage.getItem('auth_token'); // Fetch from localStorage
//     if (storedToken) {
//       this.token = storedToken;
//     }
//   }

//   // Get the token, prioritize in-memory token
//   getToken(): string | null {
//     return this.token;
//   }

//   // Set the token in memory and localStorage
//   setToken(token: string): void {
//     this.token = token;
//    // localStorage.setItem('auth_token', token); // Save to localStorage for persistence
//   }

//   // Clear the token from both memory and localStorage
//   clearToken(): void {
//     this.token = null;
//     localStorage.removeItem('auth_token'); // Remove from localStorage
//   }
// }
