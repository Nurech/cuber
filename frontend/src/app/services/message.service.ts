import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  title = 'grokonez';
  description = 'Angular-WebSocket Demo';

  greetings = new BehaviorSubject<string[]>([]);
  disabled = true;
  private stompClient: any;
  private greetingsStrings: string[] = [];

  constructor() { }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings.next([]);
    }
  }

  connect() {
    const socket = new SockJS(environment.baseUrl + '/gkz-stomp-endpoint');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: string) => {
      this.setConnected(true);
      console.log('Connected: ' + frame);

      this.stompClient.subscribe('/topic/hi', (hello: { body: string; }) => {
        this.showGreeting(JSON.parse(hello.body).greeting);
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
    this.greetingsStrings.push(message);
    this.greetings.next(this.greetingsStrings);
  }
}
