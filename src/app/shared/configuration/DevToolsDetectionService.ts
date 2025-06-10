import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import devtoolsDetect from 'devtools-detect';
import { ApiService } from 'src/app/Auth/authentication/sign-in/api.service';

@Injectable({
  providedIn: 'root'
})
export class DevToolsDetectionService {
  private isDevToolsOpen: boolean = false;
  private windowWidthThreshold = 200; // Threshold width for detecting DevTools opening
  private isWindowSizeChanged = false;

  constructor(private router: Router, private authService: ApiService) {
    this.startPolling();
    this.checkWindowSize();
  }

  private startPolling() {
    // Polling every second to check if DevTools are open
    const intervalId = setInterval(() => {
      const currentStatus = devtoolsDetect.isOpen;

      console.log('DevTools Open Status:', currentStatus);

      // If DevTools are detected open or window size changes significantly
      if ((currentStatus && !this.isDevToolsOpen) || this.isWindowSizeChanged) {
        this.isDevToolsOpen = currentStatus;
        console.log('DevTools detected or window size changed, logging out...');
        this.handleLogout();
        clearInterval(intervalId); // Stop polling once detected
      }
    }, 1000); // Check every second
  }

  private checkWindowSize() {
    // Monitor the window size to detect DevTools opening
    window.addEventListener('resize', () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < this.windowWidthThreshold && !this.isWindowSizeChanged) {
        this.isWindowSizeChanged = true;
        console.log('Window size changed (likely due to DevTools opening), logging out...');
        this.handleLogout();
      }
    });
  }

  private handleLogout() {
    this.authService.logout(); // Perform logout
    sessionStorage.clear(); // Clear session data
    this.router.navigate(['/auth/signin']); // Redirect to login page
  }
}
