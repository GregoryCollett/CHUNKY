'use strict';

angular.module('chunky')
.directive('envelope', function() {
	return {
		restrict: 'EA',
		template: '<canvas></canvas>',
		replace: true,
		scope: {
			params: '=',
			inverted: '='
		},
		link: function(scope, elem) {
			var cvs = elem,
			// cont = elem.parent(),
			ctx = cvs[0].getContext('2d'),
			w = cvs[0].width,
			h = cvs[0].height,
			w4 = w/4;

			// This is temporary and should be user defined in the users stylesheet!
			cvs.css('background-color', 'rgba(9,12,21,0.6)')
			.css('border', '1px solid rgb(57,64,72)');

			function draw() {
				requestAnimationFrame(draw);

				ctx.clearRect(0,0,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();

				if (!scope.inverted) {

					ctx.moveTo(w4 * (1.0 - scope.params.attack), h);

					ctx.lineTo(w4, 0);
					ctx.lineTo(w4 * (scope.params.decay + 1), h * (1.0 - scope.params.sustain));
					ctx.lineTo(w4 * 3, h * (1.0 - scope.params.sustain));
					ctx.lineTo(w4 * (scope.params.release + 3), h);
				} else {
					ctx.moveTo(w4 * (1.0 - scope.params.attack), 0);

					ctx.lineTo(w4, h);
					ctx.lineTo(w4 * (scope.params.decay + 1), h * (1.0 - scope.params.sustain));
					ctx.lineTo(w4 * 3, h * (1.0 - scope.params.sustain));
					ctx.lineTo(w4 * (scope.params.release + 3), 0);
				}

				ctx.strokeStyle = 'rgb(196,221,232)';
				ctx.stroke();
			}

			// do stuff on resize of window
			// $window.window.on('resize', function() {

			// });

			draw();
		}
	};
});
