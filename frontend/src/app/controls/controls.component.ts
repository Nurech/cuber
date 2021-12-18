import { Component, OnInit } from '@angular/core';
import { CubeControlService } from '../services/cube-control.service';
import { Subscription } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  isLocked: boolean = false;
  isCastConnected: boolean = true;
  subs: Subscription[] = [];
  isPlaying: boolean = false;
  isPaused: boolean = true;
  solution: string[] = [];
  previousSteps: string[] = [];
  solutionLength: number = 0;
  atStep: number = 0;
  isSolved: boolean = false;
  isStop: boolean = false;

  constructor(private cubeControlService: CubeControlService) { }

  ngOnInit(): void {
    const isLocked = this.cubeControlService.useLockedControls.subscribe(data => this.isLocked = data);
    const isSolved = this.cubeControlService.isSolved.subscribe(data => this.onSolved(data));
    const twistHappened = this.cubeControlService.twistHappened.subscribe(() => this.shouldFlushSolution());
    this.subs.push(...[isLocked, isSolved,twistHappened]);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  changeLocked() {
    this.isLocked = !this.isLocked;
    this.cubeControlService.changeLocked(this.isLocked);
  }

  getSolution() {
    this.cubeControlService.cube.isSolving = true;
    this.solution = [...this.cubeControlService.getSolution()];
    console.log(this.solution);
    this.solutionLength = this.solution.length;
    console.log(this.solutionLength);
    this.previousSteps = [];
    this.atStep = 0;
    this.changeThumbLabel();
  }

  onLeft() {
    let step = this.previousSteps.pop();
    if (step != null) {
      this.cubeControlService.cube.undo();
      this.solution.unshift(step);
      this.atStep -= 1;
      this.changeThumbLabel()
    } else {
      setTimeout(() => {
        this.atStep = 0;
        this.isPlaying = false;
      },100)
    }
  }

  onPause() {
    this.isPlaying = false;
    this.isPaused = true;
  }

  async onPlay() {
    const timer = (ms: number) => new Promise<number>(res => setTimeout(res, ms));
    this.isPlaying = true;
    console.warn(this.solution);
    while (this.solution.length) {
      if (this.isPlaying) {
        console.warn(this.solution);
        await timer(this.cubeControlService.twistDuration + 25);
        this.onRight();
      } else {
        return;
      }
    }
    this.isPlaying = false;
  }

  onRight() {
    let step = this.solution.shift();
    if (step != null) {
      this.cubeControlService.cube.twist(step);
      this.previousSteps.push(step);
      this.atStep += 1;
      this.changeThumbLabel()
      if (!this.solution.length) {
        setTimeout(() => {
          this.atStep = 0;
          this.isPlaying = false;
        },100)
      }
    }
  }

  onSolved(data: boolean) {
    this.isSolved = data;
    if (this.isSolved) {
      this.solution = [];
      this.previousSteps = [];
      this.atStep = 0;
    }
  }

  async onSliderChange(event: MatSliderChange) {
    if (event.value == null) return;
    const timer = (ms: number) => new Promise<number>(res => setTimeout(res, ms));

    this.isPlaying = true;
    this.isPaused = false;

    while (this.previousSteps.length != event.value && !this.isPaused) {
      if (event.value < this.previousSteps.length) {
        await timer(this.cubeControlService.twistDuration + 25);
        this.onLeft();
      } else if (event.value > this.previousSteps.length) {
        await timer(this.cubeControlService.twistDuration + 25);
        this.onRight();
      }
    }

    this.isPlaying = false;
  }

  /**
   * Because displayWith format call back goes nuts when template change is triggered, we resort to this
   */

  changeThumbLabel() {
    let thumbLabel = document.getElementsByClassName('mat-slider-thumb-label-text').item(0);
    console.info(thumbLabel)
    if (!thumbLabel) return;
    thumbLabel.innerHTML = this.atStep + '/'+ this.solutionLength
  }

  /**
   * When user makes a twist during solve we should probably flush the old solution because it's not valid anymore
   */
  private shouldFlushSolution() {
    // if (    this.cubeControlService.cube.isSolving ) {
    //   this.solution = []
    //   this.isPlaying = false;
    //   this.isPaused = true;
    // }
  }
}
