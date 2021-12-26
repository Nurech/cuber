import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CubeControlService } from '../services/cube-control.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  isLiveSolving = true;
  isLocked: boolean = false;
  isCastConnected: boolean = true;
  private subs: Subscription[] = [];

  constructor(private cubeControlService: CubeControlService) { }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    const isLocked = this.cubeControlService.useLockedControls.subscribe(data => this.isLocked = data);
    this.subs.push(...[isLocked]);
  }

  onTabChange(event: MatTabChangeEvent) {
    console.log(event)
    this.cubeControlService.userOnTab.next(event.index)
  }

  changeLocked() {
    this.isLocked = !this.isLocked;
    this.cubeControlService.changeLocked(this.isLocked);
  }
}
