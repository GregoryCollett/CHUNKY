'use strict';

angular.module('chunky')
	.directive('killRightClick', function($document) {
		return {
			restrict: 'CA',
			link: function(el) {
				$document.on('contextmenu', function(e) {
					//e.preventDefault();
				});
			}
		};
	});