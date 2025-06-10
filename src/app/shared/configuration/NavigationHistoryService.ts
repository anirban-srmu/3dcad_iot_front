import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {
  private history: string[] = []; // Stores the history of visited pages
  private currentPage = new BehaviorSubject<string>(''); // Current page that the user is on

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Add the current page to history when navigating to a new page
        this.history.push(event.url);
        this.currentPage.next(event.url); // Update current page
      }
    });
  }

  // Get the navigation history
  getHistory() {
    return this.history;
  }

  // Get the current page the user is on
  getCurrentPage() {
    return this.currentPage.getValue();
  }

  // Clear history on logout
  clearHistory() {
    this.history = [];
    this.currentPage.next('');
  }
}
