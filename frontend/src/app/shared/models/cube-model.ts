/**
 * Some basic convenience accessors, didn't convert everything, just the basics
 */
export interface Cuber {
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
  hideLabelText: Function;
  showFaceLabels: Function;
  showLabelText: Function;
  redo: Function;
  undo: Function;
  shuffle: Function;
  cubelets: Cubelet[];
  twistQueue: Queue;
  rotation: any;
  domElement: any;
  camera: any;
  object3D: any;
  position: Position;
  isSolved: Function;
}

interface Queue {
  future: [];
  history: [];
  isLooping: boolean;
  isReady: boolean;
  useHistory: boolean;
  validate: Function;
}


export interface Cubelet {
  faces: Face[];
  colors: string;
  changeFaceColor: Function;
  isTweening: boolean;
  position: Position;
  addressX: number;
  addressY: number;
  addressZ: number;
  type: string;
  id: number;
  left: Side;
  right: Side;
  up: Side;
  down: Side;
  front: Side;
  back: Side;
}

export interface Side {
  color: Color;
  element: HTMLElement;
  id: number;
  isIntrovert: boolean;
  normal: string;
}

export interface Position {
  x: number;
  y: number;
  z: number;

  set(x: number, y: number, z: number): void;
}

export interface Face {
  color: Color;
  id: number;
}

export interface Color {
  hex: string;
  initial: string;
  name: string;
  styleB: string;
  styleF: string;
}

export interface Direction {
  id: number;
  initial: string;
  name: string;
  neighbors: any;
  normal: any;
  opposite: any;
}
