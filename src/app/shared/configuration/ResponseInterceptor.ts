// // response-interceptor.service.ts
// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class ResponseInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(req).pipe(
//       tap(
//         (event: HttpEvent<any>) => {
//           if (event instanceof HttpResponse) {
//             // Log or process the response internally
//             //console.log('Response intercepted internally:', event.body);
//             // You can add additional conditions to process or block the response
//           }
//         },
//         (error) => {
//           console.error('Error intercepted:', error);
//         }
//       )
//     );
//   }
// }
