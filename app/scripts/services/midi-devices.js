'use strict';

angular.module('chunky')
	.service('MidiDevices', function($window) {
		return {
			isSupported: function () {
				this.supported = ($window.navigator && 'function' === typeof $window.navigator.requestMIDIAccess);
				return this.supported;
			},
			supported: false,
			connect: function() {
				if(this.isSupported()) {
					$window.navigator.requestMIDIAccess();
				} else {
					this.supported = false;
				}
			}
		};
	});