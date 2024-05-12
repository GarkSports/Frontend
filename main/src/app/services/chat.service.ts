import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatContactDTO, ChatDTO } from 'src/models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8089';

    contactList: ChatContactDTO[] = [];
    discussionList: ChatDTO[] = [];

    constructor(private http: HttpClient) { }

    public fetchContactList(): Observable<ChatContactDTO[]>{
      return this.http.get<ChatContactDTO[]>(`${this.apiUrl}/chat/usersWithMessages`,{ withCredentials: true })
    }

    public getDiscussion(userId2: number): Observable<ChatDTO[]> {
      return this.http.get<ChatDTO[]>(`${this.apiUrl}/chat/history?userId2=${userId2}`, { withCredentials: true });
    }

    public sendMessage(receiverId: number, message: string): Observable<ChatDTO> {
      return this.http.post<ChatDTO>(`${this.apiUrl}/chat/send`, { receiverId, message }, { withCredentials: true });
    }


    
}
