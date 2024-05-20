import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPosts } from 'src/models/posts.model';
import { CookieService } from 'ngx-cookie-service';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class PostsService {

    private apiUrl =environment.apiUrl;

    blogPosts: any[] = [];

    constructor(private http: HttpClient) { }


    public getPosts(): Observable<BlogPosts[]>{
        return this.http.get<BlogPosts[]>(`${this.apiUrl}posts/getacademiePosts`,{ withCredentials: true });
    }

    public addPost(postData: any): Observable<BlogPosts> {
      return this.http.post<BlogPosts>(`${this.apiUrl}posts/addpost`, postData, { withCredentials: true });
    }
    


    public deletePost(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}posts/deletepost/${id}`);
    }

    public updatePost(id: number, postData: any): Observable<BlogPosts> {
      return this.http.put<BlogPosts>(`${this.apiUrl}posts/updatepost/${id}`, postData);
    }

    public SetToken(token: string) {
      const params = new HttpParams().set('token', token);
      return this.http.post(`${this.apiUrl}notification/addtoken`, { params,withCredentials: true });
    }





  }

