import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Academie } from 'src/models/academie.model';
import { Manager } from 'src/models/manager.model';

@Injectable({
  providedIn: 'root'
})
export class AcademieService {
  private apiUrl = 'http://localhost:8089/academie';
  private apiUrlManager = 'http://localhost:8089/random';

  constructor(private http: HttpClient) { }

  addAcademie(academieData: Academie, disciplineIds: number[], managerId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const requestBody = {
      academie: academieData,
      disciplineIds: disciplineIds,
    };
  
    return this.http.post<any>(`${this.apiUrl}/addAcademie/${managerId}`, requestBody, { headers });
  }
  

  getAcademies(): Observable<Academie[]> {
    return this.http.get<Academie[]>(`${this.apiUrl}/getAcademies`);
  }

  getAcademieById(academieId: number): Observable<Academie> {
    return this.http.get<Academie>(`${this.apiUrl}/getAcademieById/${academieId}`);
  }  

  updateAcademie(academieData: Academie, academieId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<any>(`${this.apiUrl}/updateAcademie/${academieId}`, academieData, { headers });
  }

  changeEtat(academieId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/changeEtat/${academieId}`, {});
  }

  archiveAcademie(academieId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/archiveAcademie/${academieId}`, {});
  }

  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrlManager}/getManagers`);
  }

  getManagerDetails(academieId: number): Observable<Manager> {
    const url = `${this.apiUrl}/getManagerDetails/${academieId}`;
    return this.http.get<Manager>(url);
  }
}
