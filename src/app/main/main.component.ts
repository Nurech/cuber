import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CubeControlService } from '../services/cube-control.service';
import { Cube } from '../services/cube-model';

declare var presets: any;
declare var ERNO: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterContentInit {
  private cube: Cube;

  constructor(private cubeControlService: CubeControlService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
  }

  onShuffle() {
    this.cube.shuffle();
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
    presets.presetBling();
  }

  presetHighlightCore() {
  }

  ready() {
    // @ts-ignore
    this.cube = window.cube;
    this.cube.twistDuration = 50;
    console.log(window);
    console.log(this.cube);
  }


  presetWireframe() {
    presets.presetWireframe();
  }

  presetTextAnimate() {
    presets.presetTextAnimate();
  }

  demo() {
    presets.presetDemo();
  }
}

