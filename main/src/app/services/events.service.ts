import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adherent } from 'src/models/adherent.model';
import { Equipe } from 'src/models/equipe.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  academieId = 1;
  private baseUrl = 'http://localhost:8089/random';

  constructor(private http: HttpClient) { }
  getEquipes(): Observable<Equipe[]> {
    const url = `${this.baseUrl}/getEquipes/${this.academieId}`;
    return this.http.get<Equipe[]>(url);
  }

  getMembers(): Observable<Adherent[]> {
    const url = `${this.baseUrl}/getAdherents/${this.academieId}`;
    return this.http.get<Adherent[]>(url);
  }


}
