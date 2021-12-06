import { __decorate } from "tslib";
import { Component } from '@angular/core';
let MainComponent = class MainComponent {
    constructor(cubeControlService) {
        this.cubeControlService = cubeControlService;
        this.isSolved = true;
        this.isHidden = true;
        this.isLiveSolving = false;
    }
    ngOnChanges(changes) {
        console.log(changes);
    }
    ngOnInit() {
        this.cubeControlService.currentCube.subscribe(cube => this.cube = cube);
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
    ready() {
        this.cubeControlService.createNewCube();
        this.cube = window.cube;
        this.isSolved = true;
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
    turnRegular() {
        this.cubeControlService.turnRegular();
    }
    turnGray() {
        this.cubeControlService.turnGray();
    }
    tweenToStart() {
        this.cubeControlService.tweenToStart();
    }
    logCube() {
        this.cubeControlService.logCube();
    }
    getCubeCurrentState() {
        this.cubeControlService.getCubeCurrentState();
    }
    subscriptions() {
        this.cubeControlService.isSolved.subscribe(data => this.isSolved = data);
        this.cubeControlService.isHidden.subscribe(data => this.isHidden = data);
    }
};
MainComponent = __decorate([
    Component({
        selector: 'app-main',
        templateUrl: './main.component.html',
        styleUrls: ['./main.component.css']
    })
], MainComponent);
export { MainComponent };
//# sourceMappingURL=main.component.js.map