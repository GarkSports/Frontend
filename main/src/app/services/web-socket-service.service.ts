import { Injectable } from '@angular/core';
import * as SockJs from 'sockjs-client'
import * as Stomp from 'stompjs'

@Injectable({
  providedIn: "root",
})
export class WebSocketService {

    // Open connection with the back-end socket
    public connect() {
        let socket = new SockJs(`http://localhost:8089/socket`);

        let stompClient = Stomp.over(socket);

        return stompClient;
    }
}