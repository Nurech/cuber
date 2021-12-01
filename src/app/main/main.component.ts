import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CubeControlService } from '../services/cube-control.service';

declare var presets: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private cube: any;

  constructor(private cubeControlService: CubeControlService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  ngOnInit(): void {
    this.cubeControlService.currentCube.subscribe(cube => this.cube = cube)
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
    this.cubeControlService.presetBling();
  }

  presetHighlightCore() {
    presets.presetHighlightCore()
  }

  ready() {
    this.cubeControlService.createNewCube()
    this.cube = window.cube;
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

  presetHighlightWhite() {
    presets.presetHighlightWhite()
  }

  presetDemoStop() {
    presets.presetDemoStop()
  }

  presetPurty() {
    presets.presetPurty()
  }

  presetNormal() {
    presets.presetNormal()
  }

  presetHighlightCenters() {
    presets.presetHighlightCenters()
  }

  presetHighlightEdges() {
    presets.presetHighlightEdges()
  }

  presetHighlightCorners() {
    presets.presetHighlightCorners()
  }

  presetLogo() {
    presets.presetLogo()
  }


  presetIds() {
    presets.presetIds()
  }

  showGray() {
    presets.showGray()
  }

  paintDifferent() {
    this.cubeControlService.paintFace(11,1,4)
    this.cubeControlService.paintFace(11,2,4)

  }

  whiteOnTop() {
    this.cubeControlService.cube
    this.cubeControlService.paintFace(0,1,4)
    this.cubeControlService.paintFace(0,2,4)
    this.cube.twist( 'Y')
    this.cube.twist( 'D')
  }

  turnRegular() {
    this.cubeControlService.turnRegular()
  }

  turnGray() {
    this.cubeControlService.turnGray()
  }

  tweenToStart() {
    this.cubeControlService.tweenToStart()
  }


  solve() {
    this.cubeControlService.solve()
  }
}

