import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discipline } from 'src/models/discipline.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {
  private apiUrl = environment.apiUrl+ 'discipline';

  constructor(private http: HttpClient) { }

  addDiscipline(disciplineData: Discipline): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/addDiscipline`, disciplineData, { headers });
  }

  getDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrl}/getDisciplines`);
  }

  deleteDiscipline(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteDiscipline/${id}`);
  }

  updateDiscipline(id: number, disciplineData: Discipline): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<any>(`${this.apiUrl}/updateDiscipline/${id}`, disciplineData, { headers });
  }

  addDisciplineManager(disciplineData: Discipline): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/addDisciplineManager`, disciplineData,{withCredentials: true});
  }

  getDisciplinesManager(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrl}/getAllDisciplines`,{withCredentials: true});
  }
}
