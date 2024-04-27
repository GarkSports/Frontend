import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =  environment.apiUrl+'auth';
  private apiAcademie = environment.apiUrl+ 'academie';
  router: any;
  constructor(private http: HttpClient) { }

  authenticate(uname: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const formData = { uname, password };

    return this.http.post<any>( environment.apiUrl+'auth/authenticate', formData, { headers })
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

  logout(): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true // Include credentials with the request
    };
    return this.http.post<string>(`${this.apiUrl}/logout`, null, httpOptions);
  }

  checkAuthenticated(): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true // Include credentials with the request
    };
    return this.http.get<boolean>(`${this.apiUrl}/checkAccessToken`,httpOptions);
  }


  checkIfManager(): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true // Include credentials with the request
    };
    return this.http.get<boolean>(`${this.apiAcademie}/checkIfManager`, httpOptions);
  }

  checkIfAdmin(): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true // Include credentials with the request
    };
    return this.http.get<boolean>(`${this.apiAcademie}/checkIfAdmin`, httpOptions);
  }


}
