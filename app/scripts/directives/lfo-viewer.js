'use strict';

angular.module('chunky')
	.directive('lfoViewer', function($window) {
		return {
			restrict: 'EA',
			template: '<canvas></canvas>',
			replace: true,
			scope: {
				phase: '=',
				amplitude: '=',
				frequency: '='
			},
			link: function(scope, elem, attrs) {
				var cvs = elem,
					container = elem.parent(),
					ctx = cvs[0].getContext('2d'),
					// helpful vars
					twoPi = Math.pi * 2,
					// lfo specific variables
					phase = scope.phase || '',
					amplitude = scope.amplitude || '',
					frequency = scope.frequency || ''

					// set some basic styling for the canvas element
					cvs.css('background-color', 'rgba(9,12,21,0.6)')
	        			.css('border', '1px solid rgb(57,64,72)');

				function draw() {
					var drawVisual = requestAnimationFrame(draw);
				}

				draw();
			}
		};
	});