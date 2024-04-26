// import { Injectable } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpErrorResponse, HttpHeaders,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable()
// export class Auth implements HttpInterceptor {
//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     // if (request.url.indexOf("api/v1/auth") !== -1 || request.url === CONSTANTS.CLOUDINARY_URL|| request.url === "https://restcountries.com/v3.1/all") {
//     //   return next.handle(request);
//     // }

//     // const token = getItem("user")?.token;

//     let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     // if (token) {
//     //   headers = headers.append('Authorization', Bearer ${token});
//     // }

//     // Add withCredentials and headers to the cloned request
//     request = request.clone({ headers, withCredentials: true });


//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         // Handle error here
//         console.error('Error occurred:', error);
//         // You can display a message to the user based on the error status
//         if (error.status === 401) {
//           // Unauthorized error, display a message or redirect to login page
//           console.log('Unauthorized access. Please login again.');
//         } else {
//           // Other errors, display a generic message
//           console.log('An error occurred. Please try again later.');
//         }

//         // Optionally rethrow the error to propagate it further
//         return throwError(error);
//       })
//     );
//   }
// }