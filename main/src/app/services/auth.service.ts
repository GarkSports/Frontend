import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  authenticate(uname: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const formData = { uname, password };

    return this.http.post('http://localhost:8089/auth/authenticate', formData, {
      withCredentials: true,
      headers,
    });
  }

  getCookieValue(): string {
    return this.cookieService.get('accessToken');
  }
}