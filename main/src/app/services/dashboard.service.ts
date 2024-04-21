import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Academie } from 'src/models/academie.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8089/dashboard';

  constructor(private http: HttpClient) { }

  countAcademies(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countAcademies`);
  }

  countDisciplines(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countDisciplines`);
  }

  countManagers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countManagers`);
  }

  countAdherents(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countAdherents`);
  }

  countEntraineurs(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countEntraineurs`);
  }

  countEvenements(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countEvenements`);
  }

  countClubAcademie(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/countClubAcademie`);
  }

  countAcademiesByEtat(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/countAcademiesByEtat`);
  }

  countEventsWithType(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/countEventsWithType`);
  }

  getAcademiesWithMostEvents(): Observable<Academie[]> {
    return this.http.get<Academie[]>(`${this.apiUrl}/getAcademiesWithMostEvents`);
  }
}
