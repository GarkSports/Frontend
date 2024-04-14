import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPosts } from 'src/models/posts.model';

@Injectable({
    providedIn: 'root'
  })
  export class PostsService {
   
    private apiUrl = 'http://localhost:8089';

    blogPosts: any[] = [];

    constructor(private http: HttpClient) { }

    public getPosts(): Observable<BlogPosts[]>{
        return this.http.get<BlogPosts[]>(`${this.apiUrl}/posts`);
    }

    public addPost(postData: any): Observable<BlogPosts> {
      return this.http.post<BlogPosts>(`${this.apiUrl}/posts/addpost`, postData);
    }
    public deletePost(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/posts/deletepost/${id}`);
    }

    public updatePost(id: number, postData: any): Observable<BlogPosts> {
      return this.http.put<BlogPosts>(`${this.apiUrl}/posts/updatepost/${id}`, postData);
    }





  }

