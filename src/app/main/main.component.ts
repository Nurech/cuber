import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { CubeControlService } from '../services/cube-control.service';

declare var presets: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {
  private cube: any;

  constructor(private cubeControlService: CubeControlService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      // @ts-ignore
      this.cube = window.cube;
    })
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
    presets.presetHighlightCore()
  }

  ready() {
    // @ts-ignore
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
}

