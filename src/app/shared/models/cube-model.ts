/**
 * Some basic convenience accessors, didn't bother to convert everything, just the basics
 */
export interface Cube {
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
  cubelets: Cubelet[];
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
