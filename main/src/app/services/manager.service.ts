import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Academie } from 'src/models/academie.model';
import { Manager } from 'src/models/manager.model';
import { RoleName } from 'src/models/roleName.models';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'http://localhost:8089/manager';

  constructor(private http: HttpClient) {}

  addRoleName(roleName: string, permissions: string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = { roleName, permissions };

    return this.http.post<any>(`${this.apiUrl}/add-role-name`, requestBody, {
      withCredentials: true,
      headers,
    });
  }

  updateRolename(roleNameData: RoleName): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-role-name?id=${roleNameData.id}`, roleNameData, {withCredentials: true, headers });
  }
  
  deleteRolename(roleNameData: RoleName): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/delete-role-name?id=${roleNameData.id}`, { withCredentials: true, headers });
  }
  

  addStaff(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const permissionsArray = Array.isArray(managerData.permissions) ? managerData.permissions : [managerData.permissions];
    // Filter out any null or undefined values
    const filteredPermissions = permissionsArray.filter(permission => permission !== null && permission !== undefined);
  
    const requestBody = {
      email: managerData.email,
      firstname: managerData.firstname,
      lastname: managerData.lastname,
      role:managerData.role,
      roleName: managerData.roleName,
      adresse:managerData.adresse,
      photo:managerData.photo
    };
      console.log("this is service",requestBody);

    return this.http.post<any>(`${this.apiUrl}/add-staff`, requestBody, { withCredentials: true, headers });
    
  }

  addEntraineur(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const permissionsArray = Array.isArray(managerData.permissions) ? managerData.permissions : [managerData.permissions];
// Filter out any null or undefined values
    const filteredPermissions = permissionsArray.filter(permission => permission !== null && permission !== undefined);
  
    const requestBody = {
      email: managerData.email,
      firstname: managerData.firstname,
      lastname: managerData.lastname,
      role:managerData.role,
      roleName: managerData.roleName,
      adresse:managerData.adresse,
      photo:managerData.photo
    };
      console.log("this is service",requestBody);

    return this.http.post<any>(`${this.apiUrl}/add-entraineur`, requestBody, { withCredentials: true, headers });
  }

  addAdherent(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = {
      email: managerData.email,
      firstname: managerData.firstname,
      lastname: managerData.lastname,
      role: managerData.role,
      adresse: managerData.adresse,
      photo:managerData.photo
    };
  
    console.log("this is service", requestBody);
    return this.http.post<any>(`${this.apiUrl}/add-adherent`, requestBody, { withCredentials: true, headers });
  }

  updateStaff(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-staff?id=${managerData.id}`, managerData, {withCredentials: true, headers });
  }

  updateEntraineur(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-manager?id=${managerData.id}`, managerData, {withCredentials: true, headers });
  }

  updateAdherent(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-manager?id=${managerData.id}`, managerData, {withCredentials: true, headers });
  }

  updateParent(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-manager?id=${managerData.id}`, managerData, {withCredentials: true, headers });
  }
  
  getRoleNames(): Observable<RoleName[]> {
    return this.http.get<RoleName[]>(`${this.apiUrl}/get-role-names`, { withCredentials: true });
  }

  getOnlyRoleNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/get-only-role-names`, { withCredentials: true });
  }

  getPermissions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/get-permissions`, { withCredentials: true });
  }

  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/get-all-users`, { withCredentials: true });
  }

  getManagerById(ManagerId: number): Observable<Academie> {
    return this.http.get<Academie>(`${this.apiUrl}/getAcademieById/${ManagerId}`,  { withCredentials: true });
  }  

  changeEtat(ManagerId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/changeEtat?id=${ManagerId}`, {withCredentials: true});
  }

  getProfil(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/get-profil`, { withCredentials: true });
  }
  
  blockManager(ManagerId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(ManagerId);
    return this.http.put<any>(`${this.apiUrl}/block-user?id=${ManagerId}`, {}, { withCredentials: true, headers })
      .pipe(
        tap((response) => {
          console.log('Manager blocked successfully', response);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 200) {
            console.log('Manager blocked successfully');
            return of('Manager blocked successfully');
          }
          console.error('Error blocking manager', error);
          return throwError(error);
        })
      );
  }
  unBlockManager(ManagerId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(ManagerId);
    return this.http.put<any>(`${this.apiUrl}/unblock-user?id=${ManagerId}`, {}, { withCredentials: true, headers })
      .pipe(
        tap((response) => {
          console.log('Manager unblocked successfully', response);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 200) {
            console.log('Manager unblocked successfully');
            return of('Manager unblocked successfully');
          }
          console.error('Error unblocked manager', error);
          return throwError(error);
        })
      );
  }
  
  

  // unBlockManager(ManagerId: number): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/unblock-user?id=${ManagerId}`, {withCredentials: true});
  // }

  getManagerDetails(ManagerId: number): Observable<Manager> {
    return this.http.get<Manager>(`${this.apiUrl}/getManagerDetails?id=${ManagerId}`, {withCredentials: true});
  }
}
