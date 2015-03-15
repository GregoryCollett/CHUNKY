'use strict';

angular.module('chunky')
	.directive('fullscreen', function() {
		return {
			restrict: 'A',
			link: function(scope, elem) {
				console.log(elem);
				if (elem.requestFullscreen) {
				  elem.requestFullscreen();
				} else if (elem.msRequestFullscreen) {
				  elem.msRequestFullscreen();
				} else if (elem.mozRequestFullScreen) {
				  elem.mozRequestFullScreen();
				} else if (elem.webkitRequestFullscreen) {
				  elem.webkitRequestFullscreen();
				}
			}
		};
	});