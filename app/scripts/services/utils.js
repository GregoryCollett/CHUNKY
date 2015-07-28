'use strict';

angular.module('chunky')
	.service('Utils', function() {
		return {
			invert: function(buffer) {
				var i,
					length = buffer.length;

				for(i = 0; i < length; i++) {
					buffer[i] *= -1;
				}
			},
			RMS: function(buffer) {
				var total = 0,
					length = buffer.length,
					i;

				for (i = 0; i < length; i++) {
					total += buffer[i] * buffer[i];
				}

				return Math.sqrt(total / length);
			},
			peak: function(buffer) {
				var peak = 0,
					length = buffer.length,
					i;

				for (i = 0; i < length; i++) {
					peak = (Math.abs(buffer[i]) > peak) ? Math.abs(buffer[i]) : peak;
				}
			},
			magToDb: function(buffer) {
				var minDb = -120,
					minMag = Math.pow(10.0, minDb / 20.0),
					result = new Float32Array(buffer.length),
					i = 0;

				for (i = 0; i < buffer.length; i++) {
					result[i] = 20.0 * Math.log(Math.max(buffer[i], minMag));
				}

				return result;
			},
			noteToFreq: function(note) {

			},
			freqToNote: function(freq) {
				
			}
		};
	});
