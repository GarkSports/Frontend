import { Injectable } from '@angular/core';


var SockJs = require("sockjs-client");
var Stomp = require("stompjs");

@Injectable({
  providedIn: "root",
})
export class WebSocketService {

    // Open connection with the back-end socket
    public connect() {
        let socket = new SockJs(`127.0.0.1:8089/socket`);

        let stompClient = Stomp.over(socket);

        return stompClient;
    }
}