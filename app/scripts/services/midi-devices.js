'use strict';
// Midi devices is something that is in progress.
// Until I have a device to test with this will not progress
// Any help is appreciated.
angular.module('chunky')
	.service('MidiDevices', function($window) {
		return {
			list: [],
			supported: false,
			isSupported: function () {
				this.supported = ($window.navigator && 'function' === typeof $window.navigator.requestMIDIAccess);
				return this.supported;
			},
			connect: function() {
				if(this.isSupported()) {
					return $window.navigator.requestMIDIAccess();
				} else {
					this.supported = false;
				}
			}
		};
	});