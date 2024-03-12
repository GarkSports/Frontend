import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Academie } from 'src/models/academie.model';
import { Manager } from 'src/models/manager.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'http://localhost:8089/admin';
  private apiUrlManager = 'http://localhost:8089/random';

  constructor(private http: HttpClient) { }

  addManager(managerData: Manager, academieId: Academie): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const requestBody = {
      manager: managerData,
      academie: academieId,
    };
  
    return this.http.post<any>(`${this.apiUrl}/add-manager`, requestBody, { headers });
  }
  

  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/getManagers`);
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

  getManagerDetails(academieId: number): Observable<Manager> {
    const url = `${this.apiUrl}/getManagerDetails/${academieId}`;
    return this.http.get<Manager>(url);
  }
}
