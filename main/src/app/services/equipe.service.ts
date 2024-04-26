import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adherent } from 'src/models/adherent.model';
import { Discipline } from 'src/models/discipline.model';
import { Entraineur } from 'src/models/entraineur.model';
import { Equipe } from 'src/models/equipe.model';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private apiUrl = 'http://localhost:8089/random';
  private apiUrlDiscipline = 'http://localhost:8089/discipline';

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Adherent[]> {
    const url = `${this.apiUrl}/getAdherents`;
    return this.http.get<Adherent[]>(url,{withCredentials: true});
  }

  getDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrlDiscipline}/getAllDisciplines`,{withCredentials: true});
  }

  getEntraineurs(): Observable<Entraineur[]> {
    return this.http.get<Entraineur[]>(`${this.apiUrl}/getEntraineurs`,{withCredentials: true});
  }

  addEquipe(equipeData: Equipe, disciplineId: number): Observable<any> {
    const equipeRequest = {
      equipe: {
        nom: equipeData.nom, // Include only necessary fields from Equipe
        groupeAge: equipeData.groupeAge,
        genre: equipeData.genre,
        couleur: equipeData.couleur
      },
      disciplineId
    };
    console.log(equipeRequest);
    const url = `${this.apiUrl}/addEquipe`;
    return this.http.post<any>(url, equipeRequest,{withCredentials: true});
  }

  getEquipes(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(`${this.apiUrl}/getEquipes`,{withCredentials: true});
  }

  deleteEquipe(equipeId: number): Observable<void> {
    const url = `${this.apiUrl}/deleteEquipe/${equipeId}`;
    return this.http.delete<void>(url);
  }

  affectMembersToEquipe(equipeId: number, memberIds: number[]): Observable<Equipe> {
    const url = `${this.apiUrl}/affectAdherentsToEquipe/${equipeId}`;
    return this.http.post<Equipe>(url, memberIds);
  }

  affectCoachsToEquipe(equipeId: number, entraineurIds: number[]): Observable<Equipe> {
    const url = `${this.apiUrl}/affectEntraineursToEquipe/${equipeId}`;
    return this.http.post<Equipe>(url, entraineurIds);
  }




}
