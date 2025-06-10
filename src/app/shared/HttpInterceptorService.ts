import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SecretCodeService } from './SecretCodeService';
import { DevToolsDetectionService } from './configuration/DevToolsDetectionService';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private secretCodeService: SecretCodeService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //  const token = sessionStorage.getItem('accessToken');
    const secretcode=this.generateHashedNonce(15);
    const clonedReq = req.clone({
      setHeaders: {
        'X-Nonce-Secure': secretcode,
      },
    });
    
    return next.handle(clonedReq).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {

            // Get the nonce sent with the request
            const expectedNonce = clonedReq.headers.get('X-Nonce-Secure');
            const cacheControl = event.headers.get('Cache-Control');
            const age = event.headers.get('Age');

            // Vulnerability checks for caching
            if (!cacheControl || !cacheControl.includes('no-store')) {
              // console.error('Cache-Control header is missing or altered. Possible manipulation:', event.url);
            } else if (age && parseInt(age, 10) < 0) {
              // console.error('Invalid Age header value. Possible manipulation:', event.url);
            } else {
              // //console.log('Headers look valid. Processing response:', event.url);
            }
            const localsesionevents =localStorage.getItem("DOMInvaderSettings");  // Get nonce from response headers
            const responseNonce = event.headers.get('X-Nonce-Secure');  // Get nonce from response headers
            // //console.log(responseNonce);
            // //console.log(expectedNonce);
            // Ensure the nonce matches between request and response
            // if (!responseNonce || responseNonce !== expectedNonce ) {
            //   this.secretCodeService.clearSecretCode();
            //   console.warn('Nonce mismatch. Redirecting to login.');
            //   sessionStorage.clear();
            //   this.router.navigate(['/auth/signin']);
            // }
            if ( localsesionevents !== null ) {
              this.secretCodeService.clearSecretCode();
              console.warn('IT IS BURP BROWSER. Redirecting to login.');
              sessionStorage.clear();
              this.router.navigate(['/auth/signin']);
            }
            
          }
        }
      ),
      catchError((error: HttpErrorResponse) => {
        // Handle specific HTTP status codes
        if (error.status === 401 || error.status === 403) {
          this.secretCodeService.clearSecretCode();
          console.warn('Unauthorized or Forbidden request detected. Redirecting to login.');
          sessionStorage.clear();
          this.router.navigate(['/auth/signin']);
        }

        console.error('Error during request/response:', error);

        // Propagate the error with message and status to the component for toast handling
        return throwError(() => error);
      })
    );
  }

  private  generateHashedNonce(length: number): string {
    // Use some logic to generate a unique nonce (e.g., timestamp + random string)
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomString}`;
  }
}
