'use strict';

angular.module('chunky')
.directive('knob', function($document){
	return {
		restrict: 'EA',
		replace: true,
		template: 
		'<div class="knob">' +
			'<p data-ng-if="label" data-ng-bind="label" class="label"></p>' +
			'<div class="knob-face">' +
				'<div class="knob-moving-face">' +
					'<div class="knob-hand">' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<canvas class="knob-progress"></canvas>' +
		'</div>',
		scope: {
			value: '=',
			label: '@',
			options: '=',
			min: '=',
			max: '=',
			speed: '=',
			scale: '='
		},
		link: function(scope, elem, attr) {
			var defaults = {
				range: 270,
				class: scope.options.class || 'knob-default',
				responsive: scope.options.responsive || false,
				min: scope.options.min || 0,
				max: scope.options.max || 100,
				speed: scope.options.speed || 0.5,
				scale: scope.options.scale || 1,
				holdKey: false,
				groupKey: false,
			},
			params = defaults,
			startpos = params.range / 2,
			container = elem,
			face = elem.find('.knob-face'),
			movingFace = face.find('.knob-moving-face'),
			hand = movingFace.find('.knob-hand'),
			canvas = container.find('.knob-progress');

			container.addClass(params.class);

			movingFace
				.css('position', 'relative')
				.css('overflow', 'hidden')
				.css('float', 'none')
				.css('-webkit-transform', 'rotate('+(-startpos)+'deg)')
				.css('-moz-transform', 'rotate('+(-startpos)+'deg)')
				.css('-ms-transform', 'rotate('+(-startpos)+'deg)')
				.css('-o-transform', 'rotate('+(-startpos)+'deg)')
				.css('transform', 'rotate('+(-startpos)+'deg)')
				.data('degs', -startpos)
				.data('value', 0)
				.data('md', false)
				.css('z-index', '29');

			face
				.css('float', 'none');

			canvas
				.css('position', 'absolute')
				.css('top', 0)      
				.css('left', 0)
				.css('width', 0)
				.css('z-index', '0');

			if (params.responsive) {
				container.addClass('knob-responsive');
				face.css('height', face.width());
			}

			var handPos = (movingFace.width() / 2) - (hand.width() / 2);
			hand
				.css('position', 'absolute')
				.css('left', '15px')
				.css('height', movingFace.innerHeight() / 2);

			var mouse = {},
				max = params.range / 2,
				min = max * -1,
				posTracker = 0,
				range = params.max - params.min,
				rosetta = params.range / range,
				posScale = 1 / params.scale,
				degScale = (params.range / (params.max - params.min)) * params.scale;

			mouse.clickPos = 0;
			mouse.focus = false;
			mouse.holdKey = false;
			mouse.groupKey = false;
			mouse.initDeg = 0;

			function preTurn(e) {
				mouse.clickpos = e.pageY || e.originalEvent.targetTouches[0].pageY;

				mouse.focus = true;
				mouse.initdeg = movingFace.data('degs');
				elem.data('md', true);
			}

			function turn(e, touch) {
				var newPos = e.pageY || e.originalEvent.targetTouches[0].pageY;

				var degs = movingFace.data('degs'),
				diff = (mouse.clickpos - newPos) * params.speed,
				move = (diff * degScale) + degs;

				if(move < max && move > min){
					degs = move;
				} else{
					if(move > max){
						degs = max;
					}
					else if(move < min){
						degs = min;
					}
				}

				if(degs > min){
					elem.addClass('turned-on');
				} else {
					elem.removeClass('turned-on');
				}

				movingFace
					.data('degs', degs);

				movingFace.css('-webkit-transform', 'rotate('+degs+'deg)');
				movingFace.css('-moz-transform', 'rotate('+degs+'deg)');
				movingFace.css('-ms-transform', 'rotate('+degs+'deg)');
				movingFace.css('-o-transform', 'rotate('+degs+'deg)');
				movingFace.css('transform', 'rotate('+degs+'deg)');

				var regDegs = movingFace.data('degs') + max;

				var val = Math.round(regDegs / rosetta * posScale);
				val = val + (params.min * posScale);
				val = val / posScale;
				//console.log(scope.value);
				scope.$apply(function(){
					scope.value = parseFloat(val.toFixed(2));
				});

				posTracker = e.pageY || e.originalEvent.targetTouches[0].pageY;              
				e.preventDefault();
			}


			function mouseUp(){
				mouse.focus = false;
				movingFace.data('md', false);
			} 

			movingFace.on('touchstart', function(e) {
				preTurn(e);
			});

			$document.on('touchmove', function(e) {
				if (mouse.focus) {
					turn(e, true);
					scope.$apply();
				}
			});

			$document.on('touchend', function(e) {
				mouseUp();
			});

			movingFace.on('mousedown', function(e) {
				preTurn(e);
			});

			$document.on('mousemove', function(e) {
				if (mouse.focus) {
					turn(e, false);
					scope.$apply();
				}
			});

			$document.on('mouseup', function(e) {
				mouseUp();
			});

			// $document.on('contextmenu', function(e) {
			// 	e.preventDefault();
			// });
		}
	};
});