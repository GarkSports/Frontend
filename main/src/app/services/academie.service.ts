import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Academie } from 'src/models/academie.model';
import { Manager } from 'src/models/manager.model';
import { AcademieHistory } from 'src/models/academieHistory.models';
import { User } from 'src/models/user.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AcademieService {
  private apiUrl = environment.apiUrl+ 'academie';
  private apiUrlManager =  environment.apiUrl+'random';

  constructor(private http: HttpClient) { }

  addAcademie(academieData: Academie, managerId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const requestBody = {
      academie: {
        logo: academieData.logo,
        nom: academieData.nom,
        type: academieData.type,
        fraisAdhesion: academieData.fraisAdhesion,
        etat: academieData.etat,
        description: academieData.description,
        rue: academieData.rue,
        ville: academieData.ville,
        codePostal: academieData.codePostal,
        pays: academieData.pays,
      },
    };

    return this.http.post<any>(`${this.apiUrl}/addAcademie/${managerId}`, requestBody, { headers });
  }


  getAcademies(): Observable<Academie[]> {
    return this.http.get<Academie[]>(`${this.apiUrl}/getAcademies`);
  }

  getAcademieById(academieId: number): Observable<Academie> {
    return this.http.get<Academie>(`${this.apiUrl}/getDetailAcademie/${academieId}`);
  }

  updateAcademie(academieData: Academie, academieId: number, managerId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const requestBody = {
      academie: {
        logo: academieData.logo,
        nom: academieData.nom,
        type: academieData.type,
        fraisAdhesion: academieData.fraisAdhesion,
        description: academieData.description,
        rue: academieData.rue,
        ville: academieData.ville,
        codePostal: academieData.codePostal,
        pays: academieData.pays,
      },
    };

    return this.http.put<any>(`${this.apiUrl}/updateAcademie/${academieId}/${managerId}`, requestBody, { headers });
  }

  changeEtat(academieId: number, etatRequest: any): Observable<any> {
    const url = `${this.apiUrl}/changeEtat/${academieId}`;
    return this.http.put<any>(url, etatRequest);
  }

  archiveAcademie(academieId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/archiveAcademie/${academieId}`, {});
  }

  getManagers(academieId: number | undefined): Observable<Manager[]> {
    if (academieId === undefined) {
      return this.http.get<Manager[]>(`${this.apiUrlManager}/getManagersNotAssigned`);
    } else {
      return this.http.get<Manager[]>(`${this.apiUrlManager}/getManagers/${academieId}`);
    }
  }

  getManagerDetails(academieId: number): Observable<Manager> {
    const url = `${this.apiUrl}/getManagerDetails/${academieId}`;
    return this.http.get<Manager>(url);
  }

  getAcademieHistory(academieId: number): Observable<AcademieHistory[]> {
    return this.http.get<AcademieHistory[]>(`${this.apiUrl}/getAcademieHistory/${academieId}`);
  }

  countAcademies(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countAcademies`);
  }

  getAcademie(): Observable<Academie> {
    return this.http.get<Academie>(`${this.apiUrl}/getAcademieById`, { withCredentials: true });
  }

  updateAcademieProfile(academie: Academie): Observable<Academie> {
    return this.http.put<Academie>(`${this.apiUrlManager}/updateAcademie`, academie, { withCredentials: true });
  }

  updateAcademieBackground(academieId: number, background: string): Observable<any> {
    const url = `${this.apiUrlManager}/updateAcademieBackground/${academieId}`;
    return this.http.put(url, background, { responseType: 'text' });
  }

  getArchivedAcademies(): Observable<Academie[]> {
    return this.http.get<Academie[]>(`${this.apiUrl}/getArchivedAcademies`);
  }

  deleteArchivedAcademie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteArchivedAcademie/${id}`);
  }

  restoreArchivedAcademie(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/restoreArchivedAcademie/${id}`, {});
  }

  getProfil(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/get-profil`, { withCredentials: true });
  }
}
