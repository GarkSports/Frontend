import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  authenticate(uname: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const formData = { uname, password };
  
    return this.http.post<any>('http://localhost:8089/auth/authenticate', formData, { headers })
      .pipe(
        map(response => {
          localStorage.setItem('jwtToken', response.accessToken);
          console.log("this is jwtToken", response.accessToken);
          return true; // Authentication was successful
        }),
        catchError(error => {
          console.error("Authentication error:", error);
          return throwError(false); // Authentication failed
        })
      );
  }
}