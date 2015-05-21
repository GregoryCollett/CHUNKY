'use strict';

angular.module('chunky')
	.service('nodeRoutes', function() {
		// this is the default routing setup... how can we make this more dynamic
		return {
			osc1: { to: ['filter1', 'filter2'] },
			osc2: { to: ['filter1', 'filter2'] },
			osc3: { to: ['filter1', 'filter2'] },

			filter1: { to: ['distortion'] },
			filter2: { to: ['distortion'] },

			ditortion: { to: ['reverb'] },

			reverb: { to: ['master'] },

			master: { to: ['equalizer'] },

			equalizer: { to: ['analyser'] },

			analyser: { to: ['output'] }
		};
	});