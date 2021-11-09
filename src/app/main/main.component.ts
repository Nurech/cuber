import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CubeControlService } from '../services/cube-control.service';

declare var ERNO: any;
declare var TWEEN: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private cubeControlService: CubeControlService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  ngOnInit(): void {
    const container = document.getElementById('container');
    // @ts-ignore
    container.appendChild(this.cube.domElement);


    setTimeout(() => {
      this.cubeControlService.cube.twistDuration = 150;
      console.log(this.cube)
    }, 1000);


  }

  onShuffle() {
    this.cubeControlService.cube.shuffle();
  }

  undo() {
    this.cube.undo();
  }

  redo() {
    this.cube.redo();
  }

  onRotate() {
    this.cube.autoRotate = !this.cube.autoRotate;
  }

  showLabels() {
    this.cube.showFaceLabels();
  }

  hideLabels() {
    this.cube.hideFaceLabels();
  }

  presetBling() {
    this.cubeControlService.presetBling()
  }

  ready() {
    this.cubeControlService.ready()
  }
}
