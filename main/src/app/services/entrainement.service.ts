import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Equipe } from 'src/models/equipe.model';
import { Observable } from 'rxjs';
import { ConvocationEntrainement } from 'src/models/convocationEntrainement.model';
import { Adherent } from 'src/models/adherent.model';


@Injectable({
  providedIn: 'root'
})
export class EntrainementService {
  private apiUrl = environment.apiUrl + 'entrainement';

  constructor(private http: HttpClient) { }

  getEntrainements(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(`${this.apiUrl}/getEntrainements`);
  }

  addEntrainement(convocationEntrainement: ConvocationEntrainement, idEquipe: number, idAdherents: number[]): Observable<ConvocationEntrainement> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = {
      convocationEntrainement: {
        date: convocationEntrainement.date,
        heure: convocationEntrainement.heure
      },
      idAdherents: idAdherents
    };
    return this.http.post<ConvocationEntrainement>(`${this.apiUrl}/addEntrainement/${idEquipe}`, requestBody, { headers });
  }

  deleteEntrainement(idConvocation: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteEntrainement/${idConvocation}`);
  }

  getAdherentsByConvocation(idConvocation: number): Observable<Adherent[]> {
    return this.http.get<Adherent[]>(`${this.apiUrl}/getAdherentsByConvocation/${idConvocation}`);
  }

  updateConvocationEntrainement(convocationEntrainement: ConvocationEntrainement, idAdherents: number[], idConvocation: number): Observable<Equipe> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = {
      convocationEntrainement: {
        heure: convocationEntrainement.heure
      },
      idAdherents: idAdherents
    };
    return this.http.put<Equipe>(`${this.apiUrl}/updateConvocationEntrainement/${idConvocation}`, requestBody, { headers });
  }
  
  
  
  
}
