'use strict';

angular.module('chunky')
	.factory('FourierTransformer', function() {
		var FourierTransformer = function FourierTransformer(bufferSize, sampleRate) {
			this._bufferSize = bufferSize;
			this._sampleRate = sampleRate;
			this._bandwidth = 2 / this._bufferSize * this._sampleRate / 2;

			this._spectrum = new Float32Array(this._bufferSize / 2);
			this._real = new Float32Array(this._bufferSize);
			this._imag = new Float32Array(this._bufferSize);

			this._peakBand = 0;
			this._peak = 0;
		};

		FourierTransformer.prototype = Object.create(null, {
			bandFrequency: {
				value: function(i) {
					return this._bandwidth * i + this._bandwidth / 2;
				}
			},
			calculateSpectrum: {
				value: function() {
					var spectrum  = this._spectrum,
						real      = this._real,
						imag      = this._imag,
						bSi       = 2 / this._bufferSize,
						sqrt      = Math.sqrt,
						rval, 
						ival,
						mag;

					for (var i = 0, N = this._bufferSize/2; i < N; i++) {
						rval = real[i];
						ival = imag[i];
						mag = bSi * sqrt(rval * rval + ival * ival);

						if (mag > this._peak) {
							this._peakBand = i;
							this._peak = mag;
						}

						spectrum[i] = mag;
					}
				}
			}
		});

		return FourierTransformer;
	});