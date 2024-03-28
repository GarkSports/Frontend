import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPosts } from 'src/models/posts.model';

@Injectable({
    providedIn: 'root'
  })
  export class PostsService {
    static blogPosts(blogPosts: any): Observable<any> {
      throw new Error('Method not implemented.');
    }
    private apiUrl = 'http://localhost:8089';

    blogPosts: any[] = [];

    constructor(private http: HttpClient) { }

    public getPosts(): Observable<BlogPosts[]>{
        return this.http.get<BlogPosts[]>(`${this.apiUrl}/posts`);
    }


  }

