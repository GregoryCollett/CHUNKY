'use strict';

angular.module('chunky')
	.factory('DiscreteFourierTransformer', function(FourierTransformer) {
		var DiscreteFourierTransformer = function DiscreteFourierTransformer(bufferSize, sampleRate) {
			FourierTransformer.call(this, bufferSize, sampleRate);

			var twoPI = Math.PI * 2,
				n = bufferSize / 2 * bufferSize,
				i;

			this.sinTable = new Float32Array(n);
			this.cosTable = new Float32Array(n);

			for (i = 0; i < n; i++) {
				this.sinTable[i] = Math.sin(i * twoPI / bufferSize);
				this.cosTable[i] = Math.cos(i * twoPI / bufferSize);
			}
		};

		DiscreteFourierTransformer.prototype = Object.create(FourierTransformer, {
			forward: {
				value: function(buffer) {
					var real = this._real,
						imag = this._imag,
						rval,
						ival,
						k = 0,
						i = 0;

					for (k = 0; k < this._bufferSize/2; k++) {
						for (i = 0; i < buffer.length; i++) {
							rval += this.cosTable[k*n] * buffer[n];
							ival += this.sinTable[k*n] * buffer[n];
						}
						real[k] = rval;
						imag[k] = ival;
					}

					return this.calculateSpectrum();
				}
			}
		});

		return DiscreteFourierTransformer;
	});