import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { Benefices, Depenses } from 'src/models/comptabilite.model';

@Injectable({
    providedIn: 'root'
  })
  export class ComptabiliteService {
    private apiUrl = environment.apiUrl+ 'comptabilite';

    constructor(private http: HttpClient) { }

    saveBenefice(benefices: Benefices): Observable<Benefices> {
        return this.http.post<Benefices>(`${this.apiUrl}/benefices/add`, benefices, {  withCredentials: true  });
      }
    
      // Get all benefices
      getAllBenefices(): Observable<Benefices[]> {
        return this.http.get<Benefices[]>(`${this.apiUrl}/benefices/all`, {  withCredentials: true  });
      }
    
      // Get a benefice by ID
      getBeneficeById(id: number): Observable<Benefices> {
        return this.http.get<Benefices>(`${this.apiUrl}/benefices/${id}`, {  withCredentials: true });
      }
    
      // Update a benefice by ID
      updateBenefice(id: number, benefices: Benefices): Observable<Benefices> {
        return this.http.put<Benefices>(`${this.apiUrl}/benefices/update/${id}`, benefices, {  withCredentials: true });
      }
    
      // Delete a benefice by ID
      deleteBenefice(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/benefices/delete/${id}`, {  withCredentials: true  });
      }

      /////////////////////
      saveDepense(depenses: Depenses): Observable<Depenses> {
        return this.http.post<Depenses>(`${this.apiUrl}/depences/add`, depenses, {  withCredentials: true  });
      }
    
      // Get all benefices
      getAllDepenses(): Observable<Depenses[]> {
        return this.http.get<Depenses[]>(`${this.apiUrl}/depences/all`, {  withCredentials: true  });
      }
    
      // Get a benefice by ID
      getDepenseById(id: number): Observable<Depenses> {
        return this.http.get<Depenses>(`${this.apiUrl}/depences/${id}`, {  withCredentials: true });
      }
    
      // Update a benefice by ID
      updateDepense(id: number, depenses: Depenses): Observable<Depenses> {
        return this.http.put<Depenses>(`${this.apiUrl}/depences/update/${id}`, depenses, {  withCredentials: true });
      }
    
      // Delete a benefice by ID
      deleteDepense(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/depences/delete/${id}`, {  withCredentials: true  });
      }

      getmonthlystat(): Observable<any> {
        return this.http.get(`${this.apiUrl}/benefices/monthly-comparisons`, {  withCredentials: true });
      }

      getmonthlysum(): Observable<any> {
        return this.http.get(`${this.apiUrl}/benefices/monthly-sums`, {  withCredentials: true });
      }

      getbeneficepaiement() :Observable<Benefices> {
        return this.http.get<Benefices>(`${this.apiUrl}/benefices/monthBenefice`, {  withCredentials: true });
      }


  }