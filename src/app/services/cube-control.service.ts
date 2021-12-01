import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Cubelet, Direction } from '../shared/models/cube-model';
import { NgDebounce } from '../shared/decorators/debounce.decorator';
const Cube = require('cubejs');


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
  cube: any;
  private hideInvisibleFaces = false;
  private useLockedControls = true;
  currentCube = new ReplaySubject<any>(1);
  COLORLESS = window.COLORLESS;
  //           0            1           2           3            4            5
  FACES = ['.faceFront','.faceUp', '.faceRight','.faceDown','.faceLeft', '.faceBack'];
  //           0            1           2        3         4       5           6           7
  COLORS = [window.GRAY, window.G, window.Y, window.B, window.R, window.O, window.W, window.COLORLESS, 'stickerLogo'];
  COLOR_LETTER = ['H', 'G', 'Y', 'B', 'R', 'O', 'W', 'X'];
  defaultMap = [

    //  Front slice

    [ 6, 5,  ,  , 1,   ],    [ 6, 5,  ,  ,  ,   ],    [ 6, 5, 3,  ,  ,   ],//   0,  1,  2
    [ 6,  ,  ,  , 1,   ],    [ 6,  ,  ,  ,  ,   ],    [ 6,  , 3,  ,  ,   ],//   3,  4,  5
    [ 6,  ,  , 4, 1,   ],    [ 6,  ,  , 4,  ,   ],    [ 6,  , 3, 4,  ,   ],//   6,  7,  8


    //  Standing slice

    [  , 5,  ,  , 1,   ],    [  , 5,  ,  ,  ,   ],    [  , 5, 3,  ,  ,   ],//   9, 10, 11
    [  ,  ,  ,  , 1,   ],    [  ,  ,  ,  ,  ,   ],    [  ,  , 3,  ,  ,   ],//  12, XX, 14
    [  ,  ,  , 4, 1,   ],    [  ,  ,  , 4,  ,   ],    [  ,  , 3, 4,  ,   ],//  15, 16, 17


    //  3ack slice

    [  , 5,  ,  , 1, 2 ],    [  , 5,  ,  ,  , 2 ],    [  , 5, 3,  ,  , 2 ],//  18, 19, 20
    [  ,  ,  ,  , 1, 2 ],    [  ,  ,  ,  ,  , 2 ],    [  ,  , 3,  ,  , 2 ],//  21, 22, 23
    [  ,  ,  , 4, 1, 2 ],    [  ,  ,  , 4,  , 2 ],    [  ,  , 3, 4,  , 2 ] //  24, 25, 26

  ]

  constructor() {
    // This takes 4-5 seconds on a modern computer
    Cube.initSolver();
  }


  /**
   * Supply cubeletId, faceId, colorID
   */
  paintFace(cubeletId: number, faceId: number, colorId: number) {

    const cubelet: Cubelet =  this.cube.cubelets[cubeletId]
    this.quickExplodeImplode(cubelet)
    const direction: Direction = window.ERNO.Direction.getDirectionById(cubelet.faces[faceId].id)

    // Because cube can twist and rotate we need to get it's current direction relative to original face
    const currentFaceId = direction.id

    // Change the css
    cubelet.changeFaceColor(this.FACES[currentFaceId], colorId)

    // But also update cubelet colors
    let colorsStringArray = cubelet.colors.split('')
    colorsStringArray[currentFaceId] = this.COLOR_LETTER[colorId]
    cubelet.colors = colorsStringArray.join('')
    cubelet.faces[currentFaceId].color = this.COLORS[colorId]
  }

  quickExplodeImplode(cubelet: Cubelet) {

    if (cubelet.isTweening) return;

    var distance = 150;
    let startX = cubelet.position.x
    let startY = cubelet.position.y
    let startZ = cubelet.position.z

    // Explode
    new window.TWEEN.Tween( cubelet.position )
      .to({

        x: cubelet.addressX * distance,
        y: cubelet.addressY * distance,
        z: cubelet.addressZ * distance

      }, 100 )
      .easing( window.TWEEN.Easing.Quartic.Out )
      .onComplete( () => {
        // Implode
        new window.TWEEN.Tween( cubelet.position )
          .to({

            x: startX,
            y: startY,
            z: startZ

          }, 100 )
          .easing( window.TWEEN.Easing.Quartic.Out )
          .onComplete( () => {

            cubelet.isTweening = false;
          })
          .start();
      })
      .start();

    cubelet.isTweening = true;

  }


  turnRegular() {
    this.cube.twistDuration = 50;
    while (this.cube.twistQueue.history.length) {
      this.cube.undo();
      this.paintRegular();
    }
    this.paintRegular();
  }

  @NgDebounce(500)
  paintRegular() {
    this.defaultMap.forEach((faces, i) => {
      faces.forEach((color, j) => {
        if (color === undefined) return;
        this.paintFace(i, j, color);
      });
    });
    this.cube.twistDuration = 500;
  }

  twistComplete(event: any): void {
    console.log('a twist happened')
    return;
  }


  turnGray() {
    this.defaultMap.forEach((faces,i) => {
      faces.forEach((color,j) => {
        if (color === undefined) return;
        setTimeout(() => {this.paintFace(i,j,0)}, Math.random()*700)
      })
    })
  }

  tweenToStart() {
    new window.TWEEN.Tween( this.cube.rotation )
      .to({
        x: 0.31,
        y: this.degreesToRadians(-45),
        z: 0
      }, 1000 * 2 )
      .easing( window.TWEEN.Easing.Quartic.Out )
      .onComplete(() =>{
        this.cube.isReady = true
      })
      .start()
  }


  createNewCube() {
    if (this.cube) return;

    let container = document.getElementById('container');

    let useLockedControls = this.useLockedControls
     let controls = useLockedControls ? window.ERNO.Locked : window.ERNO.Freeform;

    let ua = navigator.userAgent,
      isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;

    window.cube = new window.ERNO.Cube({
      hideInvisibleFaces: this.hideInvisibleFaces,
      controls: controls,
      renderer: isIe ? window.ERNO.renderers.IeCSS3D : null
    });
    this.cube = window.cube
    this.currentCube.next(this.cube)

    if (container) {container.appendChild(this.cube.domElement );}

    if( controls === window.ERNO.Locked ){
      const fixedOrientation = new window.THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
      this.cube.object3D.lookAt( this.cube.camera.position );
      this.cube.rotation.x += fixedOrientation.x;
      this.cube.rotation.y += fixedOrientation.y;
      this.cube.rotation.z += fixedOrientation.z;
    }
    console.log(window);
    console.log(this.cube);
  }


  // Awesome
  presetBling() {
    this.cube.position.y = -2000;
    new window.TWEEN.Tween(this.cube.position)
      .to({
        y: 0
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

        x:  this.degreesToRadians(25),
        y:  this.degreesToRadians(-30),
        z: 0

      }, 1000 * 3)
      .easing(window.TWEEN.Easing.Quartic.Out)
      .onComplete( () => {

        this.cube.isReady = true;

      })
      .start();
    this.cube.isReady = false;


//  And we want each Cubelet to begin in an exploded position and tween inward.

    this.cube.cubelets.forEach( (cubelet: Cubelet) => {


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
      if (cubelet.type === 'core') delay = this.getRandomIntInclusive(0,200);
      if (cubelet.type === 'center') delay = this.getRandomIntInclusive(200,400);
      if (cubelet.type === 'edge') delay = this.getRandomIntInclusive(400,800);
      if (cubelet.type === 'corner') delay = this.getRandomIntInclusive(800,1000);


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
        })
        .start();

      cubelet.isTweening = true;
    });

  }

  getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private degreesToRadians(number: number) {
    return number * Math.PI / 180;
  }

  // Lets use cube.js to solve our cuber for us
  solve() {
    // Create a new random cube
    const randomCube = Cube.random();
    console.log(randomCube)
    console.log(randomCube.isSolved())
    let solution = randomCube.solve()
    console.log(solution)
    randomCube.move(solution)
    console.log(randomCube.isSolved())
    console.log(randomCube)
           console.log(new Cube().randomize())

  }
}
