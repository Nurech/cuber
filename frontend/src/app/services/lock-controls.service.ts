import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LockControlsService {

  //Enum of states
  STATE = { NONE: -1, ROTATE: 0, INERTIA: 1 };

  constructor() { }

  // Returns the bounding area of the element
  getBoundingClientRect( element: any ){

    return element !== document ? element.getBoundingClientRect() : {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };

  }

  lockControls(cube: any, camera: any, domElement: any, removeListeners?: boolean) {

    // For any given screen coordinates, this function
    // returns the face most likely to be associated with it.
    const getFace = function () {


      var intersection = new window.THREE.Vector3(),
        matrixInverse = new window.THREE.Matrix4(),
        plane = new window.THREE.Plane();

      var point = new window.THREE.Vector3(0, 0, 0);

      return function (faces: string | any[], x: number, y: any) {

        var i = faces.length,
          pointOfInteraction;

        cube.object3D.updateMatrixWorld();
        matrixInverse.getInverse(cube.matrixWorld);


        // For every face ...
        let face;
        while (i--) {

          point.set(x * -1, y, 0);


          // get the associated plane ...
          plane.normal.copy(faces[i].axis);
          plane.normal.x = Math.abs(plane.normal.x);
          plane.normal.y = Math.abs(plane.normal.y);
          plane.normal.z = Math.abs(plane.normal.z);
          plane.constant = cube.size * 0.5;

          plane.normal.transformDirection(initialRotation);


          // and calculate where it intersects with the coordinates
          plane.orthoPoint(point, intersection);


          if (pointOfInteraction === undefined || intersection.z <= pointOfInteraction) {
            pointOfInteraction = intersection.z;
            face = faces[i];
          }

        }

        return face;

      };
    }();
    cube.domElement.ondragstart = () => { return false; };


    const api = {
      enabled: true,
      rotationSpeed: 0.8,
      rotateOnClick: false,
      update: undefined
    };


    let projector = new window.ERNO.Projector(cube, domElement),


      axis = new window.THREE.Vector3(),
      current = new window.THREE.Vector3(),
      start = new window.THREE.Vector3(),
      direction = new window.THREE.Vector3(),
      inverse = new window.THREE.Matrix4(),
      absDirection = new window.THREE.Vector3(),
      group: { rotation: number; } | null,
      time: number, screen: { left: number; top: number; width: number; height: number; },
      sign: number,
      pixelRatio = window.devicePixelRatio || 1;
    let axisDefined = false;


    const initialRotation = new window.THREE.Matrix4().makeRotationFromEuler(new window.THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0));


    // Returns the bounding area of the element
    function getBoundingClientRect(element: any) {

      return element !== document ? element.getBoundingClientRect() : {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };

    }


    let onInteractStart = (event: any) => {

      let y;
      if (api.enabled && projector.getIntersection(camera, (event.touches && event.touches[0] || event).pageX, (event.touches && event.touches[0] || event).pageY) === null) {

        screen = getBoundingClientRect(domElement);

        var x = (event.touches && event.touches[0] || event).pageX - screen.left;
        y = (event.touches && event.touches[0] || event).pageY - screen.top;

        x *= pixelRatio;
        y *= pixelRatio;


        // If the current coordinates are outside the cube,
        // then this is a candidate for a full cube rotation.

        if (projector.getIntersection(camera, x, y) === null) {


          if (cube.isTweening() === 0) {


            // Get a time stamp
            time = (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now());


            start.set(x, y, 0);
            current.set(x, y, 0);


            domElement.removeEventListener('mousedown', onInteractStart, {passive: false});
            document.addEventListener('mousemove', onInteractMove, {passive: false});
            document.addEventListener('mouseup', onInteractEnd, {passive: false});

            domElement.removeEventListener('touchstart', onInteractStart, {passive: false});
            document.addEventListener('touchmove', onInteractMove, {passive: false});
            document.addEventListener('touchend', onInteractEnd, {passive: false});


          }

        }

      }

    };

    if (removeListeners) {
      domElement.removeEventListener('mousedown', onInteractStart, {passive: false});
      domElement.removeEventListener('touchstart', onInteractStart, {passive: false});
      return;
    }

    let onInteractMove = (event: any) => {


      let y;
      if (api.enabled) {

        event.preventDefault();

        let x = (event.touches && event.touches[0] || event).pageX - screen.left;
        y = (event.touches && event.touches[0] || event).pageY - screen.top;

        x *= pixelRatio;
        y *= pixelRatio;

        current.set(x, y, 0);


      }
    };


    let onInteractEnd = (event: any) => {


      domElement.addEventListener('mousedown', onInteractStart);
      document.removeEventListener('mousemove', onInteractMove);
      document.removeEventListener('mouseup', onInteractEnd);

      domElement.addEventListener('touchstart', onInteractStart);
      document.removeEventListener('touchmove', onInteractMove);
      document.removeEventListener('touchend', onInteractEnd);


      let y;
      if (axisDefined) {

        let command,
          velocity,
          angle;


        // We have a group, but we need an associated command expressed as a single character.

        if (group === cube.slicesDictionary['x']) command = 'x';
        else if (group === cube.slicesDictionary['y']) command = 'y';
        else if (group === cube.slicesDictionary['z']) command = 'z';


        // Find the nearest 'complete' rotation
        // @ts-ignore
        angle = -Math.round(group.rotation / Math.PI * 2.0) * Math.PI * 0.5;


        // Get the velocity of the gesture.
        velocity = direction.length() / ((typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now()) - time);


        // If the gesture is faster than a predefined speed, then we assume this
        // is a swipe rather than a drag

        if (velocity > 0.8) {


          // If we are performing a 'z' twist, we should invert the rotation calculation
          if (command === 'z') absDirection.negate();


          // Depending on the gesture direction we'll need to set the rotation to positive or negative

          angle = Math.round(absDirection.dot(direction.normalize())) * Math.PI * 0.5 * sign;

        }


        // We'll need to bound the rotation to 90 degree intervals to ensure
        // var origin = Math.round( group.rotation / Math.PI * 2.0 ) * Math.PI * 0.5;
        // angle = Math.min( Math.PI * 0.5, Math.max( Math.PI * -0.5, angle ));

        // Now that we have defined a twist, add it to the stack
        cube.twist(new window.ERNO.Twist(command, angle * 180 / Math.PI));


      } else {


        let command;

        let x = (event.touches && event.touches[0] || event).pageX - screen.left;
        y = (event.touches && event.touches[0] || event).pageY - screen.top;

        x *= pixelRatio;
        y *= pixelRatio;

        const face = getFace([cube.front, cube.right, cube.up],
          x - (screen.width * pixelRatio * 0.5),
          y - (screen.height * pixelRatio * 0.5));

        // console.log( x - ( screen.width * pixelRatio * 0.5 ),
        //     y - ( screen.width * pixelRatio * 0.5 ) );

        axis.copy(face.axis);
        inverse.getInverse(cube.matrixWorld);
        axis.transformDirection(initialRotation);
        axis.transformDirection(inverse);


        if (Math.abs(Math.round(axis.x)) === 1) command = 'z';
        else if (Math.abs(Math.round(axis.y)) === 1) command = 'y';
        else if (Math.abs(Math.round(axis.z)) === 1) command = 'x';

        if (command === 'y' && x - (screen.width * pixelRatio * 0.5) < 0) command = command.toUpperCase();

        cube.twist(command);
      }

      group = null;
      axisDefined = false;
      direction.set(0, 0, 0);
      current.set(0, 0, 0);
      start.set(0, 0, 0);
      time = 0;


    };


    //	This function provides a way to 'snap' a vector to it's closest axis.
    //	This is useful to to determine a probable axis of rotation. It's fairly naive, but it works.

    function snapVectorToBasis(vector: { x: number; y: number; z: number; }) {


      const max = Math.max(Math.abs(vector.x), Math.abs(vector.y), Math.abs(vector.z));

      vector.x = Math.round(vector.x / max);
      vector.y = vector.x === 1 ? 0 : (vector.y / max) | 0;
      vector.z = vector.x === 1 || vector.y === 1 ? 0 : (vector.z / max) | 0;

      return vector;

    }


    domElement.addEventListener('mousedown', onInteractStart);
    domElement.addEventListener('touchstart', onInteractStart);


    // @ts-ignore
    api.update = () => {


      // get a direction of movment
      direction.x = current.x - start.x;
      direction.y = current.y - start.y;


      // If we have not previously defined an axis of rotation,
      // for example, when a user begins interacting and the movement is not accidental,
      // then we can define a direction to rotate.

      if (!axisDefined && direction.length() > 30 /*&& ( start.x !== current.x || start.y !== current.y )*/) {


        axisDefined = true;

        sign = 1;


        // Get an absolute directon, we use this to find signed rotation
        absDirection.copy(direction);
        absDirection.normalize();
        absDirection.x = Math.round(absDirection.x);
        absDirection.y = Math.round(absDirection.y) * (1.0 - Math.abs(absDirection.x));
        absDirection.x = Math.abs(absDirection.x);
        absDirection.y = Math.abs(absDirection.y);
        absDirection.z = Math.abs(absDirection.z);


        // Get a vector perpendicular to the direction
        axis.set(absDirection.y * -1, absDirection.x, 0);
        axis.normalize();


        // Snap to the nearest basis

        axis.x = Math.round(axis.x);
        axis.y = Math.round(axis.y) * (1.0 - Math.abs(axis.x));
        axis.negate();


        // If the axis is horizontal, then we could be rotating on one of two axes
        if (axis.y === 0) {


          var face = getFace([cube.front, cube.right],
            current.x - (screen.width * pixelRatio * 0.5),
            current.y - (screen.width * pixelRatio * 0.5));
          axis.copy(face.axis);

          inverse.getInverse(cube.matrixWorld);
          axis.transformDirection(initialRotation);
          axis.transformDirection(inverse);


          sign = -1 * (Math.round(axis.x) || Math.round(axis.y) || Math.round(axis.z));


        }


        // Find out the associated cube group to rotate based on the axis of rotation.
        // ERNO.Cube maintains 3 special groups (X, Y, Z ) that contain all cubelets,
        // but with a different axis of rotation.

        if (Math.abs(Math.round(axis.x)) === 1) group = window.cube ? window.cube.slicesDictionary['z'] : cube.slicesDictionary['z'];
        else if (Math.abs(Math.round(axis.y)) === 1) group = window.cube ? window.cube.slicesDictionary['y'] : cube.slicesDictionary['y'];
        else if (Math.abs(Math.round(axis.z)) === 1) group = window.cube ? window.cube.slicesDictionary['x'] : cube.slicesDictionary['x'];


      }


      // If we have an axis to rotate on, then we can calculate how much to rotate by

      let angle;
      if (axisDefined) {

        angle = -(absDirection.dot(direction) / cube.size);
        if (group === cube.slicesDictionary['z']) angle *= -1;
        angle *= sign;
        // group.rotation = Math.min( Math.PI * 0.5, Math.max( Math.PI * -0.5, angle * api.rotationSpeed ));
        // @ts-ignore
        group.rotation = angle * api.rotationSpeed;
      }


    };

    return api;

  }

  unlockControls ( object:any, camera:any, domElement:any, removeListeners?: boolean ) {


    let state = this.STATE.NONE,
      direction = new window.THREE.Vector2,
      mouse = new window.THREE.Vector2(),
      mouseEnd = new window.THREE.Vector2(),
      lastPosition = new window.THREE.Vector2(),
      projector = new window.ERNO.Projector(object, domElement),

      api = {
        enabled: true,
        domElement: domElement,
        rotationSpeed: 4.0,
        damping: 0.25,
        update: undefined
      };


    const getMouseProjectionOnBall = (x: number, y: number, vector: { set: (arg0: number, arg1: number) => any; }) => {

      var view = this.getBoundingClientRect(api.domElement),
        aspect = view.height / view.width;

      var dpr = window.devicePixelRatio || 1;
      x *= dpr;
      y *= dpr;

      return vector.set(
        (x - view.width - view.left) * 0.001, // view.width,// * ( devicePixelRatio || 1 ) ,
        (view.height + view.top - y) * 0.001 // view.height// * aspect // ( devicePixelRatio || 1 )
      );

    };

    // @ts-ignore
    api.update = () => {

      var axis = new window.THREE.Vector3,
        length = 0.0,
        modelViewInverse = new window.THREE.Matrix4();

      return () => {

        if(!api.enabled || state === this.STATE.NONE ) return;


        //	define an axis to rotate on, this is basically at a tangent to the direction
        axis.set( direction.y, direction.x * -1, 0 ).normalize();


        //	The axis of rotation needs to be in mode view space, otherwise the rotation
        //	will happen in a really strange way. We therefore need to get the local rotation
        //	of the cube and the relative position of the camera and update our axis.

        modelViewInverse.getInverse( object.matrixWorld );
        modelViewInverse.multiply( camera.matrixWorld );
        axis.transformDirection( modelViewInverse );

        // If we're in a INERTIA state, then apply an inertia like effect
        direction.multiplyScalar( 1.0 - Math.max( 0.0, Math.min( 1.0, api.damping )));


        //	Determine how far we've moved. This to determine how much to rotate by
        length = direction.length();


        //	Then we can rotate the cube based on how far the drag occured
        object.object3D.rotateOnAxis( axis, -length * api.rotationSpeed );




        //	Reset our internal state
        if( state === this.STATE.ROTATE ) state = this.STATE.NONE;


          //	If the rotation is below a certain threshold specified as a factor of the damping effect,
        //	then for all purposes, any more rotation is not noticesable, so we can might aswell stop rotating.
        else if( state === this.STATE.INERTIA && length >= 0.0001 ){

          mouse.add( direction );

        } else {
          state = this.STATE.NONE
        }

      };

    };


    /**
     *	Define listeners for user initiated events
     */

    const mousedown = (event: { which: number; pageX: number; pageY: number; }) => {


      if ( !api.enabled || event.which !== 1 ) return;


      if( projector.getIntersection( camera, event.pageX, event.pageY ) === null ){


        state = this.STATE.ROTATE;


        direction.multiplyScalar( 0 );
        getMouseProjectionOnBall( event.pageX, event.pageY, mouse );
        lastPosition.copy( mouse );


        api.domElement.removeEventListener( 'mousedown', mousedown );
        document.addEventListener( 'mousemove', mousemove );
        document.addEventListener( 'mouseup', mouseup );

      }

    }

    const mousemove = (event: any) => {


      if ( api.enabled ){

        event.preventDefault();

        state = this.STATE.ROTATE;

        getMouseProjectionOnBall( event.pageX, event.pageY, mouse );

        //	Get the delta between mouse positions
        direction.subVectors( mouse, lastPosition );
        lastPosition.copy( mouse );
      }


    }

    const mouseup = (event: any) => {

      document.removeEventListener( 'mousemove', mousemove );
      document.removeEventListener( 'mouseup', mouseup );
      api.domElement.addEventListener( 'mousedown', mousedown );


      if ( api.enabled ){

        state = this.STATE.INERTIA;
      }

    }


    const touchstart = (event: any) => {

      if ( api.enabled && projector.getIntersection( camera, event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) === null ){

        state = this.STATE.ROTATE;

        direction.multiplyScalar( 0 );
        getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, mouse );
        lastPosition.copy( mouse );

        api.domElement.removeEventListener( 'touchstart', touchstart );
        document.addEventListener( 'touchend', touchend );
        document.addEventListener( 'touchmove', touchmove );
      }
    }

    const touchmove = (event: any) => {

      if ( api.enabled ){

        // event.preventDefault();

        state = this.STATE.ROTATE;

        getMouseProjectionOnBall( event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY, mouse );

        //	Get the delta between mouse positions
        direction.subVectors( mouse, lastPosition );
        lastPosition.copy( mouse );
      }

    }

    const touchend = (event: any) => {

      document.removeEventListener( 'touchend', touchend );
      document.removeEventListener( 'touchmove', touchmove );
      api.domElement.addEventListener( 'touchstart', touchstart );

      if ( api.enabled ){

        state = this.STATE.INERTIA;
      }
    }



    api.domElement.addEventListener( 'mousedown', mousedown );
    api.domElement.addEventListener( 'touchstart', touchstart );

    if (removeListeners) {
      api.domElement.removeEventListener( 'mousedown', mousedown );
      api.domElement.removeEventListener( 'touchstart', touchstart );
    }

    return api;
  };

}
