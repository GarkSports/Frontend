import { Injectable } from '@angular/core';
import * as SockJs from 'sockjs-client'
import * as Stomp from 'stompjs'
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private apiUrl =environment.apiUrl;

    // Open connection with the back-end socket
    public connect() {
        let socket = new SockJs(`${this.apiUrl}socket`);

        let stompClient = Stomp.over(socket);

        return stompClient;
    }
}