import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatContactDTO, ChatDTO } from 'src/models/chat.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = environment.apiUrl+ 'chat';

    contactList: ChatContactDTO[] = [];
    discussionList: ChatDTO[] = [];

    constructor(private http: HttpClient) { }

    public fetchContactList(): Observable<ChatContactDTO[]>{
      return this.http.get<ChatContactDTO[]>(`${this.apiUrl}/usersWithMessages`,{ withCredentials: true })
    }

    public getDiscussion(userId2: number): Observable<ChatDTO[]> {
      return this.http.get<ChatDTO[]>(`${this.apiUrl}/history?userId2=${userId2}`, { withCredentials: true });
    }

    public sendMessage(receiversId: number[], message: string): Observable<ChatDTO> {
      return this.http.post<ChatDTO>(`${this.apiUrl}/send`, { receiversId, message }, { withCredentials: true });
    }

    public deleteDiscussion(userId: number){
      return this.http.delete(`${this.apiUrl}/user/${userId}`, { withCredentials: true });
    }


    
}
