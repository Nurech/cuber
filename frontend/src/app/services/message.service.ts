import { Injectable } from '@angular/core';
import { Message } from '@stomp/stompjs';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { CubeControlService } from './cube-control.service';
import { myRxStompConfig } from '../my-rx-stomp.config';
import { UUID } from 'angular2-uuid';


/**
 * This service will setup connection info with backend
 * We also save user data to localStorage some personal UI touches (like remembering username), but it's not important
 */

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  sessionContext: SessionContext = new SessionContext();
  returnSolutionMoves = new ReplaySubject<string[]>(1);
  scanResults = new ReplaySubject<string>(1);
  connectedUsersCount= new BehaviorSubject<number>(0);

  constructor(private rxStompService: RxStompService,
              private cubeControlService: CubeControlService) {

    this.sessionContext = JSON.parse(<string>localStorage.getItem('cuber-sessionContext')) ?? new SessionContext();

    const stompConfig: InjectableRxStompConfig = Object.assign({}, myRxStompConfig, {
      beforeConnect: () => {
        console.log('%c called before connect', 'color: blue');
        console.log(this.sessionContext.token);
      },
      connectHeaders: {
        token: this.sessionContext.token
      }
    });

    this.rxStompService.configure(stompConfig);
    this.rxStompService.activate();

    this.rxStompService.watch('/topic/solutions/'+this.sessionContext.token).subscribe((solution: Message) => {this.emitSolution(solution);});
    this.rxStompService.watch('/topic/active-connections/').subscribe((count: Message) => {this.emitConnectedUsers(count);});
    this.rxStompService.watch('/topic/scan').subscribe((scan: Message) => {this.emitScanResults(scan);});
    this.rxStompService.serverHeaders$.subscribe(data => console.log(data))
    localStorage.setItem('cuber-sessionContext', JSON.stringify(this.sessionContext));
  }


  // Ask for a solution to an scrambled cube
  // Watch for returned solution on /topic/solutions/{token}
  getSolution(state: string) {
    this.rxStompService.publish({
      destination: '/app/solution',
      headers: {token: this.sessionContext.token},
      body: state
    });
  }

  // Ask for a lobby to join to
  // Watch for returned solution on /topic/lobby/{token}
  getLobby(state: string) {
    this.rxStompService.publish({
      destination: '/app/lobby',
      headers: {token: this.sessionContext.token},
      body: state
    });
  }

  emitSolution(solution: Message) {
    console.log(solution);
    let solutionMoves = this.cubeControlService.getSolutionMoves(solution.body);
    this.returnSolutionMoves.next(solutionMoves);
  }

  private emitConnectedUsers(count: Message) {
    console.log(count);
    this.connectedUsersCount.next(parseInt(count.body));
  }

  private emitScanResults(scan: Message) {
    console.log(scan);
    this.scanResults.next(scan.body);
  }

  updateUserName(userName: string) {
    if (userName.length > 15) return;
    this.sessionContext.userName = userName;
    localStorage.setItem('cuber-sessionContext', JSON.stringify(this.sessionContext));
  }
}

export class SessionContext {
  token: string = UUID.UUID();
  userName?: string;
}
