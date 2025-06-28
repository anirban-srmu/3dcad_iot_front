import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NonceService } from 'src/app/NonceService ';

@Injectable()
export class NonceInterceptor implements HttpInterceptor {

  constructor(private SecretCodeService:NonceService){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding headers for login requests
    if (req.url.includes('/auth/login')) {
      return next.handle(req);
    }

    const token = sessionStorage.getItem('accessToken');
    const nonce = this.generateHashedNonce(35);
    this.SecretCodeService.setNonce(nonce);
    // Initialize headers
    let headers = req.headers
      .set('X-Content-Type-Options', 'nosniff')
    //  .set('X-XSS-Protection', '1; mode=block')
      .set('X-Frame-Options', 'DENY')
      .set('Cache-Control', 'no-store, no-cache, must-revalidate')
      .set('Permissions-Policy', 'geolocation=(self), camera=(self)')
      .set('Feature-Policy', "microphone 'self'");
    // Add Authorization header if token exists
  //  headers = headers.set('Access-Control-Allow-Origin', 'https://taneiracatalogue.titan.in'); // You can replace '*' with your specific domain if needed
  headers = headers.set('Access-Control-Allow-Origin', '*'); // You can replace '*' with your specific domain if needed
//    headers = headers.set('Access-Control-Allow-Origin', 'https://uattaneiractlg.titan.in'); // You can replace '*' with your specific domain if needed
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Add CSP headers with nonce
    if (nonce) {
      const cspHeader = `
        default-src 'none'; 
        style-src 'self' 'unsafe-inline' 'nonce-${nonce}'; 
        style-src-elem 'self' 'unsafe-inline' 'nonce-${nonce}'; 
        script-src  'strict-dynamic'   'nonce-${nonce}' https://taneiracatalogue.titan.in  'unsafe-inline' http: https:;
        img-src 'self' https://d32s7x5wk3u0m1.cloudfront.net https://swagger.io; 
        font-src 'self' https://fonts.gstatic.com; 
        connect-src 'self'; 
        object-src 'none'; 
        base-uri 'self'; 
        frame-src 'none'; 
        form-action 'self'; 
        manifest-src 'self';
      `.replace(/\s+/g, ' ').trim(); // Ensure the header value is a single-line string

      // const cspHeader = `
      //   default-src 'none'; 
      //   style-src 'self' 'unsafe-inline' 'nonce-${nonce}'; 
      //   style-src-elem 'self' 'unsafe-inline' 'nonce-${nonce}'; 
      //   script-src  'strict-dynamic'   'nonce-${nonce}' https://uattaneiractlg.titan.in  'unsafe-inline' http: https:;
      //   img-src 'self' https://d32s7x5wk3u0m1.cloudfront.net https://swagger.io; 
      //   font-src 'self' https://fonts.gstatic.com; 
      //   connect-src 'self'; 
      //   object-src 'none'; 
      //   base-uri 'self'; 
      //   frame-src 'none'; 
      //   form-action 'self'; 
      //   manifest-src 'self';
      // `.replace(/\s+/g, ' ').trim(); // Ensure the header value is a single-line string

     headers = headers.set('Content-Security-Policy', cspHeader);
      headers = headers.set('Strict-Transport-Security', 'max-age=7776000; includeSubDomains;preload');
      headers = headers.set('X-Permitted-Cross-Domain-Policies', 'none');
      headers = headers.set('Csp-Nonce', nonce);
    }

    // Clone the request with the updated headers
    const clonedRequest = req.clone({ headers });

    return next.handle(clonedRequest);
  }

  // Method to generate a unique nonce
  private generateHashedNonce(length: number): string {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 15);
  
    // Combine the timestamp and random string
    const combinedString = `${timestamp}-${randomString}`;
  
    // Encode the combined string to Base64
    const base64Hash = btoa(combinedString);
  
    // Truncate the Base64 string to the specified length if needed
    return base64Hash.substring(0, length);
  }
  
}
