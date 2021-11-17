
var presets = {
	presetBling: function(){

    var cube = window.cube;

    cube.position.y = -2000;
    new TWEEN.Tween( cube.position )
      .to({
        y: 0
      }, 1000 * 2 )
      .easing( TWEEN.Easing.Quartic.Out )
      .start();
    cube.rotation.set(

      ( 180 ).degreesToRadians(),
      ( 180 ).degreesToRadians(),
      (  20 ).degreesToRadians()
    );
    new TWEEN.Tween( cube.rotation )
      .to({

        x: (  25 ).degreesToRadians(),
        y: ( -30 ).degreesToRadians(),
        z: 0

      }, 1000 * 3 )
      .easing( TWEEN.Easing.Quartic.Out )
      .onComplete( function(){

        cube.isReady = true;

      })
      .start();
    cube.isReady = false;


    //  And we want each Cubelet to begin in an exploded position and tween inward.

    cube.cubelets.forEach( function( cubelet ){


      //  We want to start with each Cubelet exploded out away from the Cube center.
      //  We're reusing the x, y, and z we created far up above to handle Cubelet positions.

      var distance = 2000;
      let startX = cubelet.position.x
      let startY = cubelet.position.y
      let startZ = cubelet.position.z
      cubelet.position.set(

        cubelet.addressX * distance,
        cubelet.addressY * distance,
        cubelet.addressZ * distance
      );
      console.log( cubelet.addressX, cubelet.addressY, cubelet.addressZ)

      //  Let's vary the arrival time of flying Cubelets based on their type.
      //  An nice extra little but of sauce!

      var delay;
      if( cubelet.type === 'core'   ) delay = (   0 ).random(  200 );
      if( cubelet.type === 'center' ) delay = ( 200 ).random(  400 );
      if( cubelet.type === 'edge'   ) delay = ( 400 ).random(  800 );
      if( cubelet.type === 'corner' ) delay = ( 800 ).random( 1000 );


      new TWEEN.Tween( cubelet.position )
        .to({

          x: startX,
          y: startY,
          z: startZ

        }, 2000 )
        .delay( delay )
        .easing( TWEEN.Easing.Quartic.Out )
        .onComplete( function(){

          cubelet.isTweening = false;
        })
        .start();

      cubelet.isTweening = true;
    });

		},
	presetNormal: function(){
		console.log( 'test' )
		$( 'body' ).css( 'background-color', '#000' );
		$( 'body' ).addClass( 'graydient' );
    $( '.cube .face' ).css('padding', "0.05em")
    setTimeout( function(){ $( '.cubelet' ).removeClass( 'purty' )}, 1 );;
		window.cube.show();
    window.cube.showIntroverts();
		window.cube.showPlastics();
		window.cube.showStickers();
		window.cube.hideTexts();
		window.cube.hideWireframes();
		window.cube.hideIds();
		window.cube.setOpacity();
		window.cube.setRadius();
		//updateControls( this );
	},


	presetText: function( virgin ){
		$( 'body' ).css( 'background-color', '#F00' );
		$( 'body' ).removeClass( 'graydient' );
		setTimeout( function(){ $( '.cubelet' ).removeClass( 'purty' )}, 1 );;

		var cube = this;

		// setTimeout( function(){

			cube.show();
			cube.hidePlastics();
			cube.hideStickers();
			cube.hideIds();
			cube.hideIntroverts();
			cube.showTexts();
			cube.hideWireframes();
			cube.setOpacity();
			//updateControls( cube );

		// }, 1 );
	},
	presetLogo: function(){
		var cube = this;

		this.isReady = false
		this.presetText()
		new TWEEN.Tween( cube.rotation )
		.to({
			x: 0,
			y: ( -45 ).degreesToRadians(),
			z: 0
		}, 1000 * 2 )
		.easing( TWEEN.Easing.Quartic.Out )
		.onComplete( function(){

			//updateControls( cube )
			cube.isReady = true
			cube.twist( 'E20d17' )
		})
		.start()
	},
	presetTextAnimate: function(){//  Specifically for Monica!
		var
		delay = 1,//1000 * 2,
		twistDurationScaled = [ (20+90).absolute().scale( 0, 90, 0, cube.twistDuration ), 250 ].maximum()
		_this = this

		cube.shuffleMethod = cube.ALL_SLICES
		presetHeroic( virgin )
		setTimeout( function(){

			_this.twist( 'E', 20 )
		}, delay )
		setTimeout( function(){

			_this.twist( 'd', 20 )
			//$('body').css('background-color', '#000')
		}, delay + 1000 )
		setTimeout( function(){

			_this.twist( 'D', 20 + 90 )
			_this.isRotating = true
		}, delay + 1000 * 2 )
		setTimeout( function(){

			_this.twist( 'e', 20 + 90 )
			_this.isShuffling = true
		}, delay + 1000 * 2 + twistDurationScaled + 50 )
		//updateControls( this )
	},
	presetWireframe: function( included, excluded ){
		setTimeout( function(){
      $( '.cubelet' ).removeClass( 'purty' )
      $( '.cube .face' ).css('padding', "0")
    }, 1 )
		window.cube.showIntroverts()
		if( included === undefined ) included = new ERNO.Group( window.cube.cubelets )
		if( excluded === undefined ){

			excluded = new ERNO.Group( window.cube.cubelets )
			excluded.remove( included )
		}
    window.cube.show()
		excluded.showPlastics()
		excluded.showStickers()
		excluded.hideWireframes()
		included.hidePlastics()
		included.hideStickers()
		included.showWireframes()
		//updateControls( this )
	},
  presetHighlight: function (included, excluded) {
    // if( erno.state === 'setup' ) this.presetBling()
    if (included === undefined) included = new ERNO.Group(window.cube.cubelets)
    if (excluded === undefined) {
      excluded = new ERNO.Group(window.cube.cubelets)
      excluded.remove(included)
    }
    excluded.setOpacity(0)
    included.setOpacity()
    //updateControls( this )
  },
	presetHighlightCore: function(){

		this.presetHighlight( window.cube.core )
		//updateControls( this )
	},
	presetHighlightCenters: function(){

		this.presetHighlight( window.cube.centers )
		//updateControls( this )
	},
	presetHighlightEdges: function(){

		this.presetHighlight( window.cube.edges )
		//updateControls( this )
	},
	presetHighlightCorners: function(){

		this.presetHighlight( window.cube.corners )
		//updateControls( this )
	},
	presetHighlightWhite: function(){

		this.presetHighlight( window.cube.hasColor( WHITE ))
		//updateControls( this )
	},
	presetPurty: function(){

		window.cube.showIntroverts()
		setTimeout( function(){

			$( '.cubelet' ).addClass( 'purty' )

		}, 1 )
    window.cube.rotation.set(

			( 35.3).degreesToRadians(),
			(-45  ).degreesToRadians(),
			   0
		)
		//updateControls( this )
	},
	presetDemo: function(){
		var cube  = window.cube,
      that = this,
		loops = 0,
		captions = $( '#captions' )

		window.cube.taskQueue.add(


			//  Rotation and twist demo.

			function(){

				cube.rotationDeltaX = -0.1
				cube.rotationDeltaY = 0.15
				cube.isRotating = true
        let presetNormal = () => this.presetNormal();
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.twist( 'rdRD'.multiply( 6 ))
			},


			//  Opacity demo.

			function(){

				cube.back.setOpacity( 0.2 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.standing.setOpacity( 0.2 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.twist( 'rdRD'.multiply( 3 ))
			},
			function(){

				cube.showFaceLabels()
				cube.twist( 'rdRD'.multiply( 3 ))
			},
			function(){

				cube.hideFaceLabels()
				cube.standing.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.back.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},


			//  Radial demo.

			function(){

				cube.down.setRadius( 70 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.equator.setRadius( 70 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.up.setRadius( 70 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.twist( 'rdRD'.multiply( 2 ))
			},
			function(){

				cube.back.setRadius()
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.standing.setRadius()
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.twist( 'rdRD'.multiply( 2 ))
			},
			function(){

				var excluded = new ERNO.Group( cube.cubelets ),
				included = cube.hasColors( window.R, window.Y, window.B )

				excluded.remove( included )
				excluded.setRadius()
				excluded.setOpacity( 0.5 )
				included.setRadius( 120 )
				included.setOpacity( 1 )

				cube.back.setRadius()
				cube.showIds()
				cube.taskQueue.isReady = false
				setTimeout( () => { cube.taskQueue.isReady = true }, 6000 )
			},
			function(){

				cube.twist( 'rdRD'.multiply( 2 ))
			},
			function(){

				cube.taskQueue.isReady = false
				setTimeout( () => { cube.taskQueue.isReady = true }, 6000 )
			},
			function(){

				cube.setRadius()
				cube.taskQueue.isReady = false
				setTimeout( () => { cube.taskQueue.isReady = true }, 3000 )
			},


			//  A cube is made up of cubelets
			//  and these can be a core or centers, edges, and corners.

			function(){

				captions.text( 'Core' ).fadeIn()
        that.presetHighlightCore()
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.showIds()
				cube.taskQueue.isReady = false
				setTimeout( () => { cube.taskQueue.isReady = true }, 2000 )
			},
			function(){

				cube.twist( 'rdRD'.multiply( 2 ))
			},
			function(){

				captions.text( 'Centers' )
        that.presetHighlightCenters()
				cube.twist( 'rdRD'.multiply( 4 ))
			},
			function(){

				captions.text( 'Edges' )
        that.presetHighlightEdges()
				cube.twist( 'rdRD'.multiply( 3 ))
			},
			function(){

				captions.text( 'Corners' )
        that.presetHighlightCorners()
				cube.twist( 'rdRD'.multiply( 3 ))
			},
			function(){

				captions.fadeOut()
				cube.taskQueue.isReady = false
				setTimeout( () => { cube.taskQueue.isReady = true }, 2000 )
			},


			//  Wireframe demo.

			function(){

				cube.left.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( () => { cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.left
					.hidePlastics()
					.hideStickers()
					.showWireframes()
					.showIds()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( () => { cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.middle.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( () =>{ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.middle
					.hidePlastics()
					.hideStickers()
					.showWireframes()
					.showIds()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( () =>{ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.right.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.right
					.hidePlastics()
					.hideStickers()
					.showWireframes()
					.showIds()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.twist( 'rdRD'.multiply( 3 ))
			},


			//  Text demo.

			function(){

				cube.left.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.left
					.hidePlastics()
					.hideStickers()
					.hideWireframes()
					.hideIds()
					.showTexts()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.middle.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.middle
					.hidePlastics()
					.hideStickers()
					.hideWireframes()
					.hideIds()
					.showTexts()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.right.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.right
					.hidePlastics()
					.hideStickers()
					.hideWireframes()
					.hideIds()
					.showTexts()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.twist( 'rdRD'.multiply( 3 ))
			},
			function(){

				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 * 8 )
			},


			//  Return to Normal mode

			function(){

				cube.left.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.left
					.showPlastics()
					.showStickers()
					.hideTexts()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.middle.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.middle
					.showPlastics()
					.showStickers()
					.hideTexts()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.right.setOpacity( 0 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},
			function(){

				cube.right
					.showPlastics()
					.showStickers()
					.hideTexts()
					.setOpacity( 1 )
				cube.taskQueue.isReady = false
				setTimeout( function(){ cube.taskQueue.isReady = true }, 1000 )
			},


			//  Loop it.

			function(){

				loops ++
				console.log( 'The cuber demo has completed', loops, 'loops.' )
				cube.twistQueue.history = []//  Lets just kill it outright.
			}
		)
		window.cube.taskQueue.isLooping = true
		//updateControls( window.cube )
	},
	presetDemoStop: function(){

		window.cube.taskQueue.isLooping = false
		window.cube.twistQueue.empty()
		window.cube.taskQueue.empty()
		window.cube.isRotating = false
		//updateControls( this )
	}
}
