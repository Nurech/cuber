import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CubeControlService } from '../services/cube-control.service';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RxStompService } from '@stomp/ng2-stompjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  public isLiveSolving = true;
  public isLocked: boolean = false;
  public isCastConnected: boolean = true;
  private subs: Subscription[] = [];
  public robotConnection: boolean = false;
  public backendConnection$: Observable<any> | undefined;
  public connectedUsersCount$: Observable<any> | undefined;

  constructor(private cubeControlService: CubeControlService,
              private messageService: MessageService,
              public rxStompService: RxStompService) { }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    const isLocked = this.cubeControlService.useLockedControls.subscribe(data => this.isLocked = data);
    this.subs.push(...[isLocked]);

    this.backendConnection$ = this.rxStompService.connectionState$.pipe(
      map(state => {
        console.log(state);
        // convert numeric RxStompState to string
        return RxStompState[state];
      })
    );

    this.connectedUsersCount$ = this.messageService.connectedUsersCount.pipe(data => {return data;})
  }


  onTabChange(event: MatTabChangeEvent) {
    console.log(event);
    this.cubeControlService.userOnTab.next(event);
  }

  changeLocked() {
    this.isLocked = !this.isLocked;
    this.cubeControlService.changeLocked(this.isLocked);
  }
}

export enum RxStompState {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}
