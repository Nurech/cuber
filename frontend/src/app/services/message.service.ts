import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() {
    this.initializeWebSocketConnection();
  }

  public stompClient: any;
  public msgs: any[] = [];

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, () => {
      that.stompClient.subscribe('/message', (message: { body: any; }) => {
        if (message.body) {
          that.msgs.push(message.body);
        }
      });
    });
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/send/message', {}, message);
  }

}
