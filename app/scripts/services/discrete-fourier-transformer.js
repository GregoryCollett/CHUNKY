'use strict';

angular.module('chunky')
	.factory('DiscreteFourierTransformer', function(FourierTransformer) {
		var DiscreteFourierTransformer = function DiscreteFourierTransformer(bufferSize, sampleRate) {
			FourierTransformer.call(this, bufferSize, sampleRate);

			var twoPI = Math.PI * 2;

			this.n = bufferSize / 2 * bufferSize;

			this.sinTable = new Float32Array(this.n);
			this.cosTable = new Float32Array(this.n);

			for (var i = 0; i < this.n; i++) {
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
						n = this.n;

					for (var k = 0; k < this._bufferSize/2; k++) {
						for (var i = 0; i < buffer.length; i++) {
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