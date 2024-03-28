import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';

@Injectable({
  providedIn: 'root'
})
export class blogService {

  blogPosts: any[] = [];
  
  detailId: string = '';

  constructor(public http: HttpClient) {
  }

  public getBlog(): Observable<any> {
    return of(this.blogPosts);
  }

  

}