import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Academie } from 'src/models/academie.model';
import { Manager } from 'src/models/manager.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl =  environment.apiUrl+'admin';
  private apiUrlManager =  environment.apiUrl+'random';

  constructor(private http: HttpClient) { }

  addManager(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const requestBody = {
      email: managerData.email,
      firstname: managerData.firstname,
      lastname: managerData.lastname,
      role: managerData.role,
      adresse:managerData.adresse
    };
      console.log("this is service",requestBody);

    return this.http.post<any>(`${this.apiUrl}/add-manager`, requestBody, { withCredentials: true, headers });

  }


  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/get-all-users`, { withCredentials: true });
  }

  getManagerById(ManagerId: number): Observable<Academie> {
    return this.http.get<Academie>(`${this.apiUrl}/getAcademieById/${ManagerId}`,{ withCredentials: true });
  }

  updateManager(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-manager?id=${managerData.id}`, managerData, { withCredentials: true,headers });
  }

  changeEtat(ManagerId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/changeEtat?id=${ManagerId}`, {withCredentials: true});
  }

  deleteManager(ManagerId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/archive-user?id=${ManagerId}`, {withCredentials: true});
  }

  blockManager(ManagerId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(ManagerId);

    return this.http.put<any>(`${this.apiUrl}/block-user?id=${ManagerId}`, {withCredentials: true,headers});
  }

  unBlockManager(ManagerId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/unblock-user?id=${ManagerId}`,{ withCredentials: true });
  }

  getManagerDetails(ManagerId: number): Observable<Manager> {

    return this.http.get<Manager>(`${this.apiUrl}/getManagerDetails?id=${ManagerId}`,{ withCredentials: true });
  }
}
