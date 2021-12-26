import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  title = 'grokonez';
  description = 'Angular-WebSocket Demo';

  greetings = new BehaviorSubject<string[]>([]);
  disabled = true;
  private stompClient: any;
  private greetingsStrings: string[] = []

  constructor() { }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings.next([])
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/gkz-stomp-endpoint');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame: string) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/topic/hi', function (hello: { body: string; }) {
        _this.showGreeting(JSON.parse(hello.body).greeting);
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendName(name: string) {
    if (this.stompClient != null) {
      this.stompClient.send(
        '/gkz/hello',
        {},
        JSON.stringify({'name': name})
      );
    }
  }

  showGreeting(message: string) {
    this.greetingsStrings.push(message)
    this.greetings.next(this.greetingsStrings);
  }
}
