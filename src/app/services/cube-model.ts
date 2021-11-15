export class Cube {


  constructor(paused: boolean, autoRotate: boolean, keyboardControlsEnabled: boolean, mouseControlsEnabled: boolean, isShuffling: boolean, isReady: boolean, isSolving: boolean, undoing: boolean, render: boolean, hideInvisibleFaces: boolean, time: number, moveCounter: number, twistDuration: number, shuffleMethod: string, size: number, cubeletSize: number, hideFaceLabels: Function, showFaceLabels: Function, redo: Function, undo: Function, shuffle: Function) {
    this.paused = paused;
    this.autoRotate = autoRotate;
    this.keyboardControlsEnabled = keyboardControlsEnabled;
    this.mouseControlsEnabled = mouseControlsEnabled;
    this.isShuffling = isShuffling;
    this.isReady = isReady;
    this.isSolving = isSolving;
    this.undoing = undoing;
    this.render = render;
    this.hideInvisibleFaces = hideInvisibleFaces;
    this.time = time;
    this.moveCounter = moveCounter;
    this.twistDuration = twistDuration;
    this.shuffleMethod = shuffleMethod;
    this.size = size;
    this.cubeletSize = cubeletSize;
    this.hideFaceLabels = hideFaceLabels;
    this.showFaceLabels = showFaceLabels;
    this.redo = redo;
    this.undo = undo;
    this.shuffle = shuffle;
  }

  paused: boolean;
  autoRotate: boolean;
  keyboardControlsEnabled: boolean;
  mouseControlsEnabled: boolean;
  isShuffling: boolean;
  isReady: boolean;
  isSolving: boolean;
  undoing: boolean;
  render: boolean;
  hideInvisibleFaces: boolean;
  time: number;
  moveCounter: number;
  twistDuration: number;
  shuffleMethod: string;
  size: number;
  cubeletSize: number;
  hideFaceLabels: Function;
  showFaceLabels: Function;
  redo: Function;
  undo: Function;
  shuffle: Function;
}
