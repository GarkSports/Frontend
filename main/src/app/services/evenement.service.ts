import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adherent } from 'src/models/adherent.model';
import { Equipe } from 'src/models/equipe.model';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = 'http://localhost:8089/random';

  constructor(private http: HttpClient) { }

  getEquipes(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(`${this.apiUrl}/getEquipes`,{withCredentials: true});
  }

  getMembers(): Observable<Adherent[]> {
    return this.http.get<Adherent[]>(`${this.apiUrl}/getAllAdherents`,{withCredentials: true});
  }
}
