import { Component, OnInit } from '@angular/core';
import { CubeControlService } from '../services/cube-control.service';
const { version: appVersion } = require('../../../package.json')

declare var presets: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private cube: any;
  public isSolved = true;
  public userOnTab: string = '';
  public appVersion: string;

  constructor(private cubeControlService: CubeControlService) {
    this.appVersion = appVersion
  }

  ngOnInit(): void {
    this.subscriptions();
    this.cubeControlService.createNewCube();
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
    presets.presetHighlightCore();
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
    presets.presetHighlightWhite();
  }

  presetDemoStop() {
    presets.presetDemoStop();
  }

  presetPurty() {
    presets.presetPurty();
  }

  presetNormal() {
    presets.presetNormal();
  }

  presetHighlightCenters() {
    presets.presetHighlightCenters();
  }

  presetHighlightEdges() {
    presets.presetHighlightEdges();
  }

  presetHighlightCorners() {
    presets.presetHighlightCorners();
  }

  presetLogo() {
    presets.presetLogo();
  }


  presetIds() {
    presets.presetIds();
  }

  showGray() {
    presets.showGray();
  }

  paintDifferent() {
    this.cubeControlService.paintFace(0, 0, 3);
    this.cubeControlService.paintFace(1, 0, 3);
    this.cubeControlService.paintFace(2, 0, 3);

    this.cubeControlService.paintFace(18, 4, 6);
    this.cubeControlService.paintFace(9, 4, 6);
    this.cubeControlService.paintFace(0, 4, 6);

    this.cubeControlService.paintFace(20, 5, 1);
    this.cubeControlService.paintFace(19, 5, 1);
    this.cubeControlService.paintFace(18, 5, 1);

    this.cubeControlService.paintFace(2, 2, 2);
    this.cubeControlService.paintFace(11, 2, 2);
    this.cubeControlService.paintFace(20, 2, 2);
  }

  private subscriptions() {
    this.cubeControlService.isSolved.subscribe(data => this.isSolved = data);
    this.cubeControlService.currentCube.subscribe(cube => this.cube = cube);
    this.cubeControlService.userOnTab.subscribe(change => this.userOnTab = change.tab.textLabel);
  }
}

