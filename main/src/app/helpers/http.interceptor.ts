import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const re1 = '/assets';
        const re2 = '/auth/logout';
        const re3 = '/auth/authenticate';
        
        if (request.url.search(re1) === -1
            && request.url.search(re2) === -1
            && request.url.search(re3) === -1
        ) {
            request = request.clone({
                withCredentials: true
            });
        }

        return next.handle(request);
    }
}


// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class HttpRequestInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     req = req.clone({
//       withCredentials: true,
//     });

//     return next.handle(req);
//   }
// }

// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
// ];