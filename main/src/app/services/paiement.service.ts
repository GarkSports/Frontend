import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adherent } from 'src/models/adherent.model';
import { Equipe } from 'src/models/equipe.model';
import { Paiement } from 'src/models/paiement.model';
import { PaiementHistory } from 'src/models/paiementHistory.model';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:8089/paiement';
  private apiUrlEquipe = 'http://localhost:8089/random';

  constructor(private http: HttpClient) { }

  getPaiements(): Observable<Paiement[]> {
    const url = `${this.apiUrl}/getAllPaiements`;
    return this.http.get<Paiement[]>(url,{withCredentials: true});
  }

  updatePaiement(updatedPaiement: Paiement, idPaiement: number): Observable<Paiement> {
    const url = `${this.apiUrl}/updatePaiement/${idPaiement}`;
    return this.http.put<Paiement>(url, updatedPaiement);
  }

  addPaiement(paiement: Paiement, idAdherent: number): Observable<Paiement> {
    const url = `${this.apiUrl}/addPaiement/${idAdherent}`;
    return this.http.post<Paiement>(url, paiement);
  }

  getMembers(): Observable<Adherent[]> {
    const url = `${this.apiUrl}/getAdherents`;
    return this.http.get<Adherent[]>(url,{withCredentials: true});
  }

  getPaiementHistory(adherentId: number): Observable<PaiementHistory[]> {
    const url = `${this.apiUrl}/getPaiementHistory/${adherentId}`;
    return this.http.get<PaiementHistory[]>(url);
  }

  getAdherentById(adherentId: number): Observable<Adherent> {
    const url = `${this.apiUrl}/getAdherent/${adherentId}`;
    return this.http.get<Adherent>(url);
  }

  changeStatutAdherent(adherentId: number, statutAdherent: string): Observable<Adherent> {
    const url = `${this.apiUrl}/changeStatutAdherent/${adherentId}`;
    return this.http.put<Adherent>(url, `"${statutAdherent}"`, { headers: { 'Content-Type': 'application/json' } });
  }

  deletePaiement(idPaiement: number): Observable<void> {
    const url = `${this.apiUrl}/deletePaiement/${idPaiement}`;
    return this.http.delete<void>(url);
  }

  getEquipes(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(`${this.apiUrlEquipe}/getEquipes`,{withCredentials: true});
  }
  
}
