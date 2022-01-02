import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { Cubelet, Direction } from '../shared/models/cube-model';
import { NgDebounce } from '../shared/decorators/debounce.decorator';
import { LockControlsService } from './lock-controls.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

declare var TWEEN: any;
const Queue = require('js-queue');

declare global {
  interface Window {
    cube: any;
    GRAY: any;
    COLORLESS: any;
    G: any;
    O: any;
    R: any;
    B: any;
    Y: any;
    W: any;
    TWEEN: any;
    ERNO: any;
    THREE: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CubeControlService {
  hideInvisibleFaces = false;
  useLockedControls = new BehaviorSubject<boolean>(false);
  twistDuration: number = 250;

  // Subs
  isSolved = new BehaviorSubject<boolean>(true);
  isHidden = new BehaviorSubject<boolean>(true);
  twistHappened = new Subject<any>();
  userOnTab = new ReplaySubject<MatTabChangeEvent>();
  currentCube = new ReplaySubject<any>(1);


  q = new Queue;
  cube: any;
  COLORLESS = window.COLORLESS;
  //                  0            1           2           3            4            5
  FACES_CSS = ['.faceFront', '.faceUp', '.faceRight', '.faceDown', '.faceLeft', '.faceBack'];
  //            0            1           2        3         4       5           6           7
  COLORS = [window.GRAY, window.G, window.Y, window.B, window.R, window.O, window.W, window.COLORLESS, 'stickerLogo'];
  COLOR_LETTER = ['H', 'G', 'Y', 'B', 'R', 'O', 'W', 'X'];
  defaultMap = [

    //  Front slice

    [6, 5, ], [6, 5, ], [6, 5, 3],//   0,  1,  2
    [6, , , , 1], [6, , ], [6, , 3],//   3,  4,  5
    [6, , , 4, 1], [6, , , 4], [6, , 3, 4],//   6,  7,  8


    //  Standing slice

    [, 5, , , 1], [, 5, ], [, 5, 3],//   9, 10, 11
    [, , , , 1], [, , ], [, , 3],//  12, XX, 14
    [, , , 4, 1], [, , , 4], [, , 3, 4],//  15, 16, 17


    //  Back slice

    [, 5, , , 1, 2], [, 5, , , , 2], [, 5, 3, , , 2],//  18, 19, 20
    [, , , , 1, 2], [, , , , , 2], [, , 3, , , 2],//  21, 22, 23
    [, , , 4, 1, 2], [, , , 4, , 2], [, , 3, 4, , 2] //  24, 25, 26

  ];

  colorMap = [

    //  Front slice

    ['W', 'O', 'X', 'X', 'G', 'X'], ['W', 'O', 'X', 'X', 'X', 'X'], ['W', 'O', 'B', 'X', 'X', 'X'],//   0,  1,  2
    ['W', 'X', 'X', 'X', 'G', 'X'], ['W', 'X', 'X', 'X', 'X', 'X'], ['W', 'X', 'B', 'X', 'X', 'X'],//   3,  4,  5
    ['W', 'X', 'X', 'R', 'G', 'X'], ['W', 'X', 'X', 'R', 'X', 'X'], ['W', 'X', 'B', 'R', 'X', 'X'],//   6,  7,  8


    //  Standing slice

    ['X', 'O', 'X', 'X', 'G', 'X'], ['X', 'O', 'X', 'X', 'X', 'X'], ['X', 'O', 'B', 'X', 'X', 'X'],//   9, 10, 11
    ['X', 'X', 'X', 'X', 'G', 'X'], ['X', 'X', 'X', 'X', 'X', 'X'], ['X', 'X', 'B', 'X', 'X', 'X'],//  12, XX, 14
    ['X', 'X', 'X', 'R', 'G', 'X'], ['X', 'X', 'X', 'R', 'X', 'X'], ['X', 'X', 'B', 'R', 'X', 'X'],//  15, 16, 17


    //  Back slice

    ['X', 'O', 'X', 'X', 'G', 'Y'], ['X', 'O', 'X', 'X', 'X', 'Y'], ['X', 'O', 'B', 'X', 'X', 'Y'],//  18, 19, 20
    ['X', 'X', 'X', 'X', 'G', 'Y'], ['X', 'X', 'X', 'X', 'X', 'Y'], ['X', 'X', 'B', 'X', 'X', 'Y'],//  21, 22, 23
    ['X', 'X', 'X', 'R', 'G', 'Y'], ['X', 'X', 'X', 'R', 'X', 'Y'], ['X', 'X', 'B', 'R', 'X', 'Y'] //  24, 25, 26

  ];

  // cubelet locations on face
  FACES_IDS = {
    up: [18, 19, 20, 9, 10, 11, 0, 1, 2],
    right: [2, 11, 20, 5, 14, 23, 8, 17, 26],
    front: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    down: [6, 7, 8, 15, 16, 17, 24, 25, 26],
    left: [18, 9, 0, 21, 12, 3, 24, 15, 6],
    back: [20, 19, 18, 23, 22, 21, 26, 25, 24]
  };

  originalColorFace = {
    'orange': 'U',
    'white': 'F',
    'blue': 'R',
    'yellow': 'B',
    'green': 'L',
    'red': 'D'
  };

  constructor(private lockControlsService: LockControlsService) {
    this.q.autoRun = true;
  }


  /**
   * Supply cubeletId, faceId, colorID
   */
  paintFace(cubeletId: number, faceId: number, colorId: number) {
    setTimeout(() => {
      const cubelet: Cubelet = this.cube.cubelets[cubeletId];
      this.quickExplodeImplode(cubelet);
      const direction: Direction = window.ERNO.Direction.getDirectionById(cubelet.faces[faceId].id);
      console.log(cubelet);


      // Also change convenience accessors
      if (direction.name == 'right') {
        cubelet.right.color = this.COLORS[colorId];
      } else if (direction.name == 'left') {
        cubelet.left.color = this.COLORS[colorId];
      } else if (direction.name == 'up') {
        cubelet.up.color = this.COLORS[colorId];
      } else if (direction.name == 'down') {
        cubelet.down.color = this.COLORS[colorId];
      } else if (direction.name == 'front') {
        cubelet.front.color = this.COLORS[colorId];
      } else if (direction.name == 'back') {
        cubelet.back.color = this.COLORS[colorId];
      }

      // Because cube can twist and rotate we need to get it's current direction relative to original face
      const currentFaceId = direction.id;

      // Change the css

      cubelet.changeFaceColor(this.FACES_CSS[currentFaceId], colorId);

      // But also update cubelet colors
      let colorsStringArray = cubelet.colors.split('');
      colorsStringArray[currentFaceId] = this.COLOR_LETTER[colorId];
      cubelet.colors = colorsStringArray.join('');
      console.log(cubelet.faces[currentFaceId]);
      cubelet.faces[currentFaceId].color = this.COLORS[colorId];
      console.log(cubelet.faces[currentFaceId]);
      console.log(cubelet);
    }, Math.floor(Math.random() * 1000));
  }

  quickExplodeImplode(cubelet: Cubelet) {

    if (cubelet.isTweening) return;

    var distance = 150;
    let startX = cubelet.position.x;
    let startY = cubelet.position.y;
    let startZ = cubelet.position.z;

    // Explode
    new TWEEN.Tween(cubelet.position)
      .to({

        x: cubelet.addressX * distance,
        y: cubelet.addressY * distance,
        z: cubelet.addressZ * distance

      }, 100)
      .easing(TWEEN.Easing.Quartic.Out)
      .onComplete(function () {
        // Implode
        new TWEEN.Tween(cubelet.position)
          .to({

            x: startX,
            y: startY,
            z: startZ

          }, 100)
          .easing(TWEEN.Easing.Quartic.Out)
          .onComplete(function () {

            cubelet.isTweening = false;
          })
          .start();
      })
      .start();

    cubelet.isTweening = true;

  }


  turnRegular() {
    this.cube.twistDuration = 50;
    setTimeout(() => {
      this.paintRegular();
    }, this.cube.twistDuration * (this.cube.twistQueue.history.length + 1));
    while (this.cube.twistQueue.history.length) {
      this.cube.undo();
    }
  }

  @NgDebounce(100)
  paintRegular() {
    for (let k = 0; k < this.cube.cubelets.length; k++) {
      for (let i = 0; i < this.defaultMap.length; i++) {
        for (let j = 0; j < this.defaultMap[i].length; j++) {
          if (this.defaultMap[i][j]) {
            // @ts-ignore
            this.paintFace(k, j, this.defaultMap[i][j]);
          }
        }
      }
    }
  }

  twistComplete(e: any): boolean {
    console.log(this.cube.isSolved(), e);
    this.isSolved.next(this.cube.isSolved());
    this.twistHappened.next()
    return true;
  }

  turnGray() {
    this.defaultMap.forEach((faces, i) => {
      faces.forEach((color, j) => {
        if (color === undefined) return;
        this.paintFace(i, j, 0);
      });
    });
  }

  tweenToStart() {
    new window.TWEEN.Tween(this.cube.rotation)
      .to({
        x: 0.31,
        y: this.degreesToRadians(-45),
        z: 0
      }, 1000 * 2)
      .easing(window.TWEEN.Easing.Quartic.Out)
      .onComplete(() => {
        this.cube.isReady = true;
      })
      .start();
  }


  createNewCube() {
    if (this.cube) return;

    let container = document.getElementById('container');

    let ua = navigator.userAgent,
      isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;

    window.cube = new window.ERNO.Cube({
      hideInvisibleFaces: this.hideInvisibleFaces,
      renderer: isIe ? window.ERNO.renderers.IeCSS3D : null
    });
    this.cube = window.cube;
    if (container) {
      container.appendChild(this.cube.domElement);
    }

    if (this.useLockedControls.getValue()) {
      this.changeLocked(false);
    } else {
      this.changeLocked(true);
    }

    this.addEventListeners();
    this.cube.twistDuration = this.twistDuration;
    this.playIntro();
    console.log(window);
    console.log(this.cube);
  }


  // Awesome
  presetBling() {
    this.cube.position.y = -2000;
    this.isHidden.next(false);
    new window.TWEEN.Tween(this.cube.position)
      .to({
        y: -150
      }, 1000 * 2)
      .easing(window.TWEEN.Easing.Quartic.Out)
      .start();
    this.cube.rotation.set(
      this.degreesToRadians(180),
      this.degreesToRadians(180),
      this.degreesToRadians(20)
    );
    new window.TWEEN.Tween(this.cube.rotation)
      .to({

        x: this.degreesToRadians(25),
        y: this.degreesToRadians(-30),
        z: 0

      }, 1000 * 3)
      .easing(window.TWEEN.Easing.Quartic.Out)
      .onComplete(() => {

        this.cube.isReady = true;

      })
      .start();
    this.cube.isReady = false;


//  And we want each Cubelet to begin in an exploded position and tween inward.

    this.cube.cubelets.forEach((cubelet: Cubelet) => {


      //  We want to start with each Cubelet exploded out away from the Cube center.
      //  We're reusing the x, y, and z we created far up above to handle Cubelet positions.

      const distance = 2000;
      let startX = cubelet.position.x;
      let startY = cubelet.position.y;
      let startZ = cubelet.position.z;
      cubelet.position.set(
        cubelet.addressX * distance,
        cubelet.addressY * distance,
        cubelet.addressZ * distance
      );

      //  Let's vary the arrival time of flying Cubelets based on their type.
      //  An nice extra little but of sauce!

      let delay: number = 0;
      if (cubelet.type === 'core') delay = this.getRandomIntInclusive(0, 200);
      if (cubelet.type === 'center') delay = this.getRandomIntInclusive(200, 400);
      if (cubelet.type === 'edge') delay = this.getRandomIntInclusive(400, 800);
      if (cubelet.type === 'corner') delay = this.getRandomIntInclusive(800, 1000);


      new window.TWEEN.Tween(cubelet.position)
        .to({

          x: startX,
          y: startY,
          z: startZ

        }, 2000)
        .delay(delay)
        .easing(window.TWEEN.Easing.Quartic.Out)
        .onComplete(() => {
          cubelet.isTweening = false;

          const blingFinished = new CustomEvent('blingFinished', {
            detail: {
              isTweening: false
            }
          });
          this.cube.dispatchEvent(blingFinished);

        })
        .start();

      cubelet.isTweening = true;
    });
  }

  getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  degreesToRadians(number: number) {
    return number * Math.PI / 180;
  }


  // Prints message on cube like it is talking
  async cubeTalk(message: string, timing?: number) {
    this.q.add(() => this.printMessage(message, timing));
  }

  // Use timing coefficient to increase/decrease delay (1 is default)
  private y: number | undefined;

  async printMessage(message: string, timing?: number) {

    const timer = (ms: number) => new Promise<number>(res => setTimeout(res, ms));

    const letterDelay = timing ? timing * 35 : 35;
    const waitDelay = timing ? timing * 500 : 500;

    let textLabel = document.getElementById('textLabel');
    if (!textLabel) return;

    const arrayOfChars = message.split('');

    textLabel.innerHTML = '';
    while (textLabel.firstChild) {
      textLabel.firstChild.remove();
    }
    this.cube.showLabelText();
    for (let char of arrayOfChars) {
      setTimeout(() => {
        let span = document.createElement('span');
        span.innerHTML = char;
        span.classList.add('letter');
        span.style.opacity = String(1);
        if (textLabel) {
          textLabel.appendChild(span);
        }
      }, await timer(letterDelay));
    }
    setTimeout(() => {
    }, await timer(waitDelay * 2 + (arrayOfChars.length * letterDelay)));
    console.warn('returning');
    this.cube.hideLabelText();
    setTimeout(() => {
      this.q.next();
    }, await timer(waitDelay));
    return;
  }

  logCube() {
    console.log(window);
    console.log(window.cube);
  }

  getCurrentStateString(): string {

    let up: string[] = [];
    let right: string[] = [];
    let front: string[] = [];
    let down: string[] = [];
    let left: string[] = [];
    let back: string[] = [];

    for (let [k1, v1] of Object.entries(this.FACES_IDS)) {
      for (let cubeletId of v1) {
        for (let [k2, v2] of Object.entries(this.originalColorFace)) {
          if (k2 == this.cube.cubelets[cubeletId][k1].color.name) {
            if (k1 == 'up') up.push(v2);
            if (k1 == 'right') right.push(v2);
            if (k1 == 'front') front.push(v2);
            if (k1 == 'down') down.push(v2);
            if (k1 == 'left') left.push(v2);
            if (k1 == 'back') back.push(v2);
          }
        }
      }
    }

    let currentState: string = up.join('') + right.join('') + front.join('') + down.join('') + left.join('') + back.join('');
    if (this.validateCubeState(currentState)) {
      return currentState;
    } else {
      console.warn('an invalid cube was passed, ignoring....');
      this.turnRegular();
      return '';
    }
  }


  /**
   * This translates min2cube solution from backend to cuber twist commands
   */
  getSolutionMoves(solvedCube: string) {
    console.warn(solvedCube)
    let solutionArray = solvedCube.split(' ');
    let returnArray = [];
    for (let char of solutionArray) {
      if (char !=  '') {
        if (char.includes('2')) {
          char = char.replace('2', '');
          returnArray.push(char);
        }
        if (char.includes('\'')) {
          char = char.replace('\'', '');
          char = char.toLowerCase();
          returnArray.push(char);
        } else {
          returnArray.push(char);
        }
      }
    }
    console.log(returnArray);
    return returnArray;
  }

  private addEventListeners() {
    this.cube.addEventListener('onTwistComplete', (e: any) => this.twistComplete(e));
  }

  validateCubeState(currentState: string) {
    if (currentState.length != 54) return false;
    for (let value of Object.values(this.originalColorFace)) {
      if ([...currentState].filter(char => char == value).length != 9) {
        return false;
      }
    }
    return true; // so I guess it is valid
  }

  private playIntro() {
    this.presetBling();
    this.cube.addEventListener('blingFinished', () => this.afterBling());
  }

  @NgDebounce(750)
  private async afterBling() {
    await this.cubeTalk('HELLO', 2);
    await this.cubeTalk('I AM CUBE...');
    await this.cubeTalk('GIVE ME A PUZZLE TO SOLVE');
    this.tweenToMiddle();
  }

  tweenToMiddle() {
    new TWEEN.Tween(this.cube.position)
      .to({
        y: -25
      }, 500 * 2)
      .easing(TWEEN.Easing.Quartic.Out)
      .start();

    new TWEEN.Tween(this.cube.rotation)
      .to({
        x: this.degreesToRadians(25),
        y: this.degreesToRadians(-27),
        z: this.degreesToRadians(0)
      }, 500 * 3)
      .easing(TWEEN.Easing.Quartic.Out)
      .onComplete(() => {

        this.cube.isReady = true;

      })
      .start();
    this.cube.isReady = false;

  }

  changeLocked(isLocked: boolean) {
    console.log(isLocked);
    this.lockControlsService.lockControls(this.cube, this.cube.camera, this.cube.domElement, true);
    this.lockControlsService.unlockControls(this.cube, this.cube.camera, this.cube.domElement, true);
    if (isLocked) {
      console.log('freeroam');
      this.cube.controls = new (window.ERNO.Controls)(this.cube, this.cube.camera, this.cube.domElement);
    } else {
      this.tweenToMiddle();
      console.log('locked');
      this.cube.controls = this.lockControlsService.lockControls(this.cube, this.cube.camera, this.cube.domElement);
    }
    this.useLockedControls.next(isLocked);
    console.log(this.cube);
  }
}
