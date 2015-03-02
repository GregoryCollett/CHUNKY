'use strict';

angular.module('chunky')
	.directive('envelope', function($window) {
		return {
			restrict: 'EA',
			template: '<canvas></canvas>',
			replace: true,
			scope: {
				params: '='
			},
			link: function(scope, elem, attrs) {
				var cvs = elem,
					cont = elem.parent(),
            		ctx = cvs[0].getContext('2d'),
            		w = cvs[0].width,
            		h = cvs[0].height,
            		w4 = w/4;

            	// This is temporary and should be user defined in the users stylesheet!
        		cvs.css('background-color', 'rgba(9,12,21,0.6)')
        			.css('border', '1px solid rgb(57,64,72)')
        			.css('margin-top', '5px');

            	function draw() {
            		var drawVisual = requestAnimationFrame(draw);

            		ctx.clearRect(0,0,w,h);
			        ctx.lineWidth = 2;

            		ctx.beginPath();

            		ctx.moveTo(w4 * (1.0 - scope.params.attack), h);

			        ctx.lineTo(w / 4,0);
			        //console.log('1', w / 4,0);
			        ctx.lineTo(w4 * (scope.params.decay + 1), h * (1.0 - scope.params.sustain));
			        //console.log('2',w4 * (scope.params.attack + 1), h * (1.0 - scope.params.decay))
			        ctx.lineTo(w4 * 3, h * (1.0 - scope.params.sustain));
			        //console.log('3',w4 * 3, h * (1.0 - scope.params.sustain));
			        ctx.lineTo(w4 * (scope.params.release + 3), h);
			        //console.log('4', w4 * (scope.params.release + 3), h);

			        ctx.strokeStyle = 'rgb(196,221,232)';
        			ctx.stroke();
            	}

            	// $window.window.on('resize', function() {

            	// });

            	draw();
			}
		};
	});