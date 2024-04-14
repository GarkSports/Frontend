import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class blogService {

  blogPosts: any[] = [];
  
  detailId: string = '';
  static blogPosts: any[];

  constructor(public http: HttpClient) {
  }

  public getBlog(): Observable<any> {
    return of(this.blogPosts);
  }

  

}