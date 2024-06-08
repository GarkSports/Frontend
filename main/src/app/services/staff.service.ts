import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Categorie } from "src/models/categorie.model";
import { Test } from "src/models/test.model";

@Injectable({
    providedIn: 'root'
  })

export class StaffService {
    private apiUrl = environment.apiUrl+ 'staff';
    constructor(private http: HttpClient) {}

    getTests(): Observable<Test[]> {
        return this.http.get<Test[]>(`${this.apiUrl}/academies/14/tests`, { withCredentials: true });
    }

    getTestById(testId: number): Observable<Test[]> {
        return this.http.get<Test[]>(`${this.apiUrl}/test/${testId}`, { withCredentials: true });
    }

    getCategoriesByTestId(testId: number): Observable<Categorie[]> {
        return this.http.get<Categorie[]>(`${this.apiUrl}/${testId}/categories`, { withCredentials: true });
    }

    deleteKpi(kpiId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/kpi/${kpiId}`, { withCredentials: true });
    }


    addKpi(categoryIndex: number, newKpiValue: string, categorieId: number): Observable<Categorie> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const requestBody = { kpiType: newKpiValue };
        return this.http.put<Categorie>(`${this.apiUrl}/add-fields-evaluation?categorieId=${categorieId}`, requestBody, { withCredentials: true, headers });
    }

    addCategorie(testId: number, newCategorie: any): Observable<Categorie> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Categorie>(`${this.apiUrl}/add-categorie?testId=${testId}`, newCategorie, { withCredentials: true, headers });
      }
      
      
}