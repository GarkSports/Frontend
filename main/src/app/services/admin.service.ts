import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Academie } from 'src/models/academie.model';
import { Manager } from 'src/models/manager.model';
import {environment} from "../../environments/environment";
import { map } from 'rxjs/operators';



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
      adresse:managerData.adresse,
      telephone:managerData.telephone,
      telephone2:managerData.telephone2,
      password:managerData.password
    };
      console.log("this is service",requestBody);

    return this.http.post<any>(`${this.apiUrl}/add-manager`, requestBody, { withCredentials: true, headers });

  }


  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/get-managers`, { withCredentials: true });
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

  deleteManager(ManagerId: number): Observable<{ success: boolean, message?: string, error?: string }> {
    return this.http.delete(`${this.apiUrl}/archive-user?id=${ManagerId}`, { responseType: 'text', withCredentials: true, observe: 'response' })
      .pipe(
        map((response: HttpResponse<string>) => {
          if (response.status === 200) {
            return { success: true, message: response.body || '' };
          } else {
            return { success: false, error: response.body || '' };
          }
        })
      );
  }
 
  blockManager(ManagerId: number): Observable<{ success: boolean, message?: string, error?: string }> {
    console.log(ManagerId);
    return this.http.put(`${this.apiUrl}/block-user?id=${ManagerId}`, null, { responseType: 'text', observe: 'response', withCredentials: true })
      .pipe(
        map((response: HttpResponse<string>) => {
          if (response.status === 200) {
            return { success: true, message: response.body || '' };
          } else {
            return { success: false, error: response.body || '' };
          }
        })
      );
  }
  
  unblockManager(ManagerId: number): Observable<{ success: boolean, message?: string, error?: string }> {
    console.log(ManagerId);
    return this.http.put(`${this.apiUrl}/unblock-user?id=${ManagerId}`, null, { responseType: 'text', observe: 'response', withCredentials: true })
      .pipe(
        map((response: HttpResponse<string>) => {
          if (response.status === 200) {
            return { success: true, message: response.body || '' };
          } else {
            return { success: false, error: response.body || '' };
          }
        })
      );
  }

  getManagerDetails(ManagerId: number): Observable<Manager> {

    return this.http.get<Manager>(`${this.apiUrl}/getManagerDetails?id=${ManagerId}`,{ withCredentials: true });
  }
}
