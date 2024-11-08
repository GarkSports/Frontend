import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adherent } from 'src/models/adherent.model';
import { Equipe } from 'src/models/equipe.model';
import { environment } from "../../environments/environment";
import { Evenement } from 'src/models/evenement.model';
import { PersonnaliseRequest } from 'src/models/dto/PersonnaliseRequest.model';
import { TestRequest } from 'src/models/dto/TestRequest.model';
import { MatchAmicalRequest } from 'src/models/dto/MatchAmicalRequest.model';
import { StatutEvenement } from 'src/models/enums/statutEvenenement.model';
import { CompetitionRequest } from 'src/models/dto/CompetitonRequest.model';
import { UpdateEvenementRequest } from 'src/models/dto/UpdateEvenementRequest.model';
import { UpdateEvenementRequestBody } from 'src/models/dto/updateMatchAmicalRequest.model';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = environment.apiUrl + 'random';
  private apiEvenement = environment.apiUrl + 'evenement';

  constructor(private http: HttpClient) { }

  getEquipes(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(`${this.apiUrl}/getEquipes`, { withCredentials: true });
  }

  getMembers(): Observable<Adherent[]> {
    return this.http.get<Adherent[]>(`${this.apiUrl}/getAllAdherents`, { withCredentials: true });
  }

  addCompetition(request: CompetitionRequest): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiEvenement}/addCompetition`, request, { withCredentials: true });
  }

  addPersonnalise(request: PersonnaliseRequest): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiEvenement}/addPersonnalise`, request, { withCredentials: true });
  }

  addTest(request: TestRequest): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiEvenement}/addTest`, request, { withCredentials: true });
  }

  addMatchAmical(request: MatchAmicalRequest): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiEvenement}/addMatchAmical`, request, { withCredentials: true });
  }  

  getEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiEvenement}/getAllEvenements`,{ withCredentials: true });
  }

  deleteEvenement(idEvenement: number): Observable<void> {
    const url = `${this.apiEvenement}/deleteEvenement/${idEvenement}`;
    return this.http.delete<void>(url);
  }

  changeStatutEvenement(evenementId: number, statutEvenenement: StatutEvenement): Observable<Evenement> {
    const url = `${this.apiEvenement}/changeStatutEvenement/${evenementId}`;
    return this.http.put<Evenement>(url, `"${statutEvenenement}"`, { headers: { 'Content-Type': 'application/json' } });
  }

  getMembersByEquipe(idEquipe: number): Observable<Adherent[]> {
    return this.http.get<Adherent[]>(`${this.apiEvenement}/getMembersByEquipe/${idEquipe}`);
  }

  getMembersByEvent(idEvenement: number): Observable<Adherent[]> {
    return this.http.get<Adherent[]>(`${this.apiEvenement}/getMembersByEvenement/${idEvenement}`);
  }

  updateEvenement(evenementId: number, evenementData: UpdateEvenementRequest): Observable<Evenement> {
    const requestBody = {
      evenement: {
        nomEvent: evenementData.evenement.nomEvent,
        lieu: evenementData.evenement.lieu,
        date: evenementData.evenement.date,
        heure: evenementData.evenement.heure,
      },
      idMembres: evenementData.idMembres,
    };
    const url = `${this.apiEvenement}/updateEvenement/${evenementId}`;
    return this.http.put<Evenement>(url, requestBody, { withCredentials: true });
  }

  updateEvenementMatchAmical(evenementId: number, evenementData: UpdateEvenementRequestBody): Observable<Evenement> {
    const url = `${this.apiEvenement}/updateEvenementMatchAmical/${evenementId}`;
    return this.http.put<Evenement>(url, evenementData, { withCredentials: true });
  }

  getEquipesByEvenementMatchAmical(idEvenement: number): Observable<Equipe[]> {
    const url = `${this.apiEvenement}/getEquipesByEvenementMatchAmical/${idEvenement}`;
    return this.http.get<Equipe[]>(url);
  }
  
  
  
}
