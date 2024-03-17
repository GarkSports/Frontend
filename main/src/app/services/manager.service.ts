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

  addManager(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const requestBody = {
      manager: managerData
    
    };
  
    return this.http.post<any>(`${this.apiUrl}/add-manager`, requestBody, { withCredentials: true, headers });
  }
  

  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/get-all-users`, { withCredentials: true });
  }

  getManagerById(ManagerId: number): Observable<Academie> {
    return this.http.get<Academie>(`${this.apiUrl}/getAcademieById/${ManagerId}`);
  }  

  updateManager(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}/updateManager?id=${managerData.id}`;
    return this.http.put<any>(url, managerData, { headers });
  }

  changeEtat(ManagerId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/changeEtat?id=${ManagerId}`, {});
  }

  deleteManager(ManagerId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/archive-user?id=${ManagerId}`, {});
  }

  blockManager(ManagerId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/block-user?id=${ManagerId}`, {});
  }

  unBlockManager(ManagerId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/unblock-user?id=${ManagerId}`, {});
  }

  getManagerDetails(ManagerId: number): Observable<Manager> {
    const url = `${this.apiUrl}/getManagerDetails?id=${ManagerId}`;
    return this.http.get<Manager>(url);
  }
}
