import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../Auth/authentication/sign-in/api.service';
import { SessionService } from './configuration/SessionService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    

    return this.verifyAccess(url);
  }

  private verifyAccess(url: string): Observable<boolean> {
    const token = sessionStorage.getItem('accessToken');
    


    return of(token).pipe(
      map(token => {
        if (!token) {
          this.performLogout();
          return false;
        }
        if (this.isRouteAllowed(url)) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']); // Special route for 403
          return false;
        }
      }),
      catchError(() => {
        this.performLogout();
        return of(false);
      })
    );
  }

  private isRouteAllowed(url: string): boolean {
    const allowedRoutes = this.getAllowedRoutes();
    
    // Debug: Log both values being compared
    console.log('Checking route access for:', {
      currentUrl: url,
      allowedRoutes: allowedRoutes
    });
  
    const isAllowed = allowedRoutes.some(route => {
      const match = url.includes(route);
      console.log(`Does "${url}" include "${route}"?`, match);
      return match;
    });
  
    console.log('Final access decision:', isAllowed);
    return isAllowed;
  }

  private getAllowedRoutes(): string[] {
    // Implement role-based logic here if needed
    return [
      '/dashboard',
      '/profile'
      // Add other allowed base routes
    ];
  }

  async performLogout() {
    try {
      await this.apiService.logout();
      //  this.toastr.success('Logged out successfully');
      this.router.navigate(['/auth/signin']);
    } catch (error) {
      ///  this.toastr.warning('Logged out locally (API unavailable)');
      this.router.navigate(['/auth/signin']);
    }
  }


}