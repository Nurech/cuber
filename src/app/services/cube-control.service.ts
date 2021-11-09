import { Injectable } from '@angular/core';

declare var ERNO: any;
declare var TWEEN: any;
declare var THREE: any;

@Injectable({
  providedIn: 'root'
})
export class CubeControlService {

  // We start the cube in service, so were always manipulating the same cube and we can carry it between components
  cube: any;

  constructor() {
    // this.cube = new ERNO.Cube();
  }

  presetBling() {

    this.cube.position.y = -2000;
    new TWEEN.Tween(this.cube.position)
      .to({
        y: 0
      }, 1000 * 2)
      .easing(TWEEN.Easing.Quartic.Out)
      .start();
    this.cube.rotation.set(
      (180).degreesToRadians(),
      (180).degreesToRadians(),
      (20).degreesToRadians()
    );
    new TWEEN.Tween(this.cube.rotation)
      .to({

        x: (25).degreesToRadians(),
        y: (-30).degreesToRadians(),
        z: 0

      }, 1000 * 3)
      .easing(TWEEN.Easing.Quartic.Out)
      .onComplete(() => {

        this.cube.isReady = true;

      })
      .start();
    this.cube.isReady = false;


//  And we want each Cubelet to begin in an exploded position and tween inward.

    this.cube.cubelets.forEach((cubelet: any) => {


      //  We want to start with each Cubelet exploded out away from the Cube center.
      //  We're reusing the x, y, and z we created far up above to handle Cubelet positions.

      var distance = 1000;
      cubelet.position.set(
        cubelet.addressX * distance,
        cubelet.addressY * distance,
        cubelet.addressZ * distance
      );


      //  Let's vary the arrival time of flying Cubelets based on their type.
      //  An nice extra little but of sauce!

      var delay;
      if (cubelet.type === 'core') delay = (0).random(200);
      if (cubelet.type === 'center') delay = (200).random(400);
      if (cubelet.type === 'edge') delay = (400).random(800);
      if (cubelet.type === 'corner') delay = (800).random(1000);


      new TWEEN.Tween(cubelet.position)
        .to({

          x: 0,
          y: 0,
          z: 0

        }, 1000)
        .delay(delay)
        .easing(TWEEN.Easing.Quartic.Out)
        .onComplete(function () {

          cubelet.isTweening = false;
        })
        .start();

      cubelet.isTweening = true;
    });

  }

  ready(){

    console.log('ready')

    const useLockedControls = true,
      controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;

    const ua = navigator.userAgent,
      isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;

    this.cube = new ERNO.Cube({
      hideInvisibleFaces: true,
      controls: controls,
      renderer: isIe ? ERNO.renderers.IeCSS3D : null
    });


    const container = document.getElementById('container');
    container.appendChild( this.cube.domElement );



    if( controls === ERNO.Locked ){
      var fixedOrientation = new THREE.Euler(  Math.PI * 0.1, Math.PI * -0.25, 0 );
      this.cube.object3D.lookAt( this.cube.camera.position );
      this.cube.rotation.x += fixedOrientation.x;
      this.cube.rotation.y += fixedOrientation.y;
      this.cube.rotation.z += fixedOrientation.z;
    }


    // The deviceMotion function provide some subtle mouse based motion
    // The effect can be used with the Freeform and Locked controls.
    // This could also integrate device orientation on mobile

    // var motion = deviceMotion( cube, container );

    // motion.decay = 0.1; 				// The drag effect
    // motion.range.x = Math.PI * 0.06;	// The range of rotation
    // motion.range.y = Math.PI * 0.06;
    // motion.range.z = 0;
    // motion.paused = false;				// disables the effect



  }

}
