import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Academie } from 'src/models/academie.model';
import { Manager } from 'src/models/manager.model';
import { RoleName } from 'src/models/roleName.models';
import {environment} from "../../environments/environment";
import { ChangePasswordChange } from 'src/models/changePassword.model';
import { User } from 'src/models/user.model';
import { Adherent } from 'src/models/adherent.model';
import { Test } from 'src/models/test.model';
import { AdherentRequest } from 'src/models/adherentRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = environment.apiUrl+ 'manager';

  constructor(private http: HttpClient) {}

  addRoleName(name: string, permissions: string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = { name, permissions };

    return this.http.post<any>(`${this.apiUrl}/add-role-name`, requestBody, {
      withCredentials: true,
      headers,
    });
  }

  updateRolename(roleNameData: RoleName): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-role-name?id=${roleNameData.id}`, roleNameData, {withCredentials: true, headers });
  }
  
  deleteRolename(roleNameId: number): Observable<{ success: boolean, message?: string, error?: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/delete-role-name?id=${roleNameId}`, { withCredentials: true, headers })
    .pipe(
      map((response: HttpResponse<string>) => {
        if (response.status === 200) {
          try {
            const responseData = JSON.parse(response.body || '');
            return { success: true, message: responseData.message };
          } catch (e) {
            return { success: true, message: response.body || 'Role name deleted successfully' };
          }
        } else {
          return { success: false, error: response.body || '' };
        }
      })
    );
  }
  
  deleteUser(userId: number): Observable<{ success: boolean, message?: string, error?: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/delete-user?id=${userId}`, { withCredentials: true, headers })
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
      telephone: managerData.telephone,
      photo:managerData.photo
    };
      console.log("this is service",requestBody);

    return this.http.post<any>(`${this.apiUrl}/add-staff`, requestBody, { withCredentials: true, headers });
    
  }

  addEntraineur(managerData: Manager, nomEquipesForManager: string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const permissionsArray = Array.isArray(managerData.permissions) ? managerData.permissions : [managerData.permissions];
// Filter out any null or undefined values
    const filteredPermissions = permissionsArray.filter(permission => permission !== null && permission !== undefined);

    const requestBody = {
      email: managerData.email,
      firstname: managerData.firstname,
      lastname: managerData.lastname,
      dateNaissance: managerData.dateNaissance,
      role:managerData.role,
      roleName: managerData.roleName,
      adresse:managerData.adresse,
      nationalite: managerData.nationalite,
      photo:managerData.photo,
      telephone: managerData.telephone
    };

     let params = new HttpParams();
    if (nomEquipesForManager.length > 0) {
      params = params.append('equipeNames', nomEquipesForManager.join(','));
    }
 
     console.log("this is service", requestBody);
      console.log("this is service",requestBody);

    return this.http.post<any>(`${this.apiUrl}/add-coach`, requestBody, { headers, params, withCredentials: true });
  }

  addAdherent(adherent: Adherent, equipeNames: string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = {
      firstname: adherent.firstname,
      lastname: adherent.lastname,
      adresse: adherent.adresse,
      email: adherent.email,
      telephone: adherent.telephone,
      photo: adherent.photo,
      niveauScolaire: adherent.niveauScolaire,
      dateNaissance: adherent.dateNaissance, // Convert date to ISO string format
      nationalite: adherent.nationalite
    };
  
    // Construct the URL with query parameters
    let params = new HttpParams();
    if (equipeNames.length > 0) {
      params = params.append('equipeNames', equipeNames.join(','));
    }
  
    console.log("this is service", requestBody);
    return this.http.post<any>(`${this.apiUrl}/add-adherent`, requestBody, { headers, params, withCredentials: true });
  }
  

  updateStaff(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-staff?id=${managerData.id}`, managerData, {withCredentials: true, headers });
  }

  updateEntraineur(managerData: Manager, equipeNames: string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const joinedEquipeNames = Array.isArray(equipeNames) ? equipeNames.join(',') : equipeNames;
    return this.http.put<any>(`${this.apiUrl}/update-coach?id=${managerData.id}&equipeNames=${joinedEquipeNames}`, managerData, { withCredentials: true, headers });
  }

  updateAdherent(adherentData: Adherent, equipeNames: string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const joinedEquipeNames = Array.isArray(equipeNames) ? equipeNames.join(',') : equipeNames;
    return this.http.put<any>(`${this.apiUrl}/update-adherent?id=${adherentData.id}&equipeNames=${joinedEquipeNames}`, adherentData, { withCredentials: true, headers });
  }

  updateParent(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-parent?id=${managerData.id}`, managerData, {withCredentials: true, headers });
  }

  changePassword(pwdData: ChangePasswordChange): Observable<any> {
    console.log('Payload:', pwdData);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/reset-password`, pwdData, { withCredentials: true, headers, observe: 'response', responseType: 'text' })
    .pipe(
      map(response => response.body as string)
    );  
  }

  updateManager(managerData: Manager): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/update-manager`, managerData, { withCredentials: true,headers });
  }

  getEquipesByAdherentEmail(id: number): Observable<any> { 
    return this.http.get(`${this.apiUrl}/equipes/by-adherent-id?id=${id}`, { withCredentials: true });
  }

  getEquipesByEntraineurId(id: number): Observable<any> { 
    return this.http.get(`${this.apiUrl}/equipes/by-entraineur-id?id=${id}`, { withCredentials: true });
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
    return this.http.get<Manager[]>(`${this.apiUrl}/get-users`, { withCredentials: true });
  }

  getManagerById(ManagerId: number): Observable<Academie> {
    return this.http.get<Academie>(`${this.apiUrl}/getAcademieById/${ManagerId}`,  { withCredentials: true });
  }

  getFormManagerById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getFormManagerById/${id}`,  { withCredentials: true });
  }

  changeEtat(ManagerId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/changeEtat?id=${ManagerId}`, {withCredentials: true});
  }

  getProfil(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/get-profil`, { withCredentials: true });
  }

  getManagerProfil(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/get-manager-profil`, { withCredentials: true });
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
