'use strict';

angular.module('chunky')
	.factory('Noise', function() {
		var NoiseTypes = {
			white: function(e) {
				var output, i;
				output = e.outputBuffer.getChannelData(0);

				for(i = 0; i < output.length; i++) {
					output[i] = Math.random() * 2 - 1;
				}
			},
			pink: function(e) {
				var b0, b1, b2, b3, b4, b5, b6, output, white, i;
				b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
				output = e.outputBuffer.getChannelData(0);

				for(i = 0; i < output.length; i++) {
					white = Math.random() * 2 - 1;
					b0 = 0.99886 * b0 + white * 0.0555179;
					b1 = 0.99332 * b1 + white * 0.0750759;
					b2 = 0.96900 * b2 + white * 0.1538520;
					b3 = 0.86650 * b3 + white * 0.3104856;
					b4 = 0.55000 * b4 + white * 0.5329522;
					b5 = -0.7616 * b5 - white * 0.0168980;
					output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
					output[i] *= 0.11; // (roughly) compensate for gain
					b6 = white * 0.115926;
				}
			},
			brown: function(e) {
				var output, white, lastOut, i;
				output = e.outputBuffer.getChannelData(0);
				lastOut = 0.0;
				for (i = 0; i < output.length; i++) {
					white = Math.random() * 2 - 1;
					output[i] = (lastOut + (0.02 * white)) / 1.02;
					lastOut = output[i];
					output[i] *= 3.5; // (roughly) compensate for gain
				}
			}
		};

		var Noise = function(ctx, cfg) {
			cfg = cfg || {};

			this.ctx = ctx;
			this.type = 'noise';

			this.node = this.ctx.createScriptProcessor(2048, 1, 1);
			this._wet = this.ctx.createGain();
			this._controlGain = this.ctx.createGain();
			this.output = this.ctx.createGain();

			this._enabled = false;
			this._type = cfg.type || 'white';
			this._wet.gain.value = 0;
			this.output.gain.value = 0;

			this.node.onaudioprocess = NoiseTypes[this._type];

			this.node.connect(this._wet);
			this._wet.connect(this._controlGain);
			this._controlGain.connect(this.output);
		};

		Noise.prototype = Object.create(null, {
			connect: {
				value: function(target) {
					this.output.connect(target);
				}
			},
			disconnect: {
				value: function() {
					this.output.disconnect();
				}
			},
			start: {
				value: function() {
					this.output.gain.setValueAtTime(1, 0);
				}
			},
			stop: {
				value: function() {
					this.output.gain.setValueAtTime(0, 0);
				}
			},
			gain: {
				enumerable: true,
				get: function() {
					return this._controlGain.gain.value;
				},
				set: function(gain) {
					this._controlGain.gain.setValueAtTime(gain, 0);
				}
			},
			enabled: {
				enumerable: true,
				get: function() {
					return this._enabled;
				},
				set: function(enabled) {
					this._enabled = enabled;
					if (this._enabled) {
						this._wet.gain.setValueAtTime(1, 0);
					} else {
						this._wet.gain.setValueAtTime(0, 0);
					}
				}
			},
			generator: {
				enumerable: true,
				get: function() {
					return this._type;
				},
				set: function(type) {
					this._type = type;
					this.node.onaudioprocess = NoiseTypes[type];
				}
			},
			cfg: {
				get: function() {
					return {
						generator: this.generator,
						gain: this.gain
					};
				},
				set: function(cfg) {
					this.generator = cfg.generator;
					this.gain = cfg.gain;
				}
			}
		});

		Noise.White = function(ctx) {
			var cfg = {};
			cfg.onaudioprocess = function(e) {
				var output, i;
				output = e.outputBuffer.getChannelData(0);

				for(i = 0; i < output.length; i++) {
					output[i] = Math.random() * 2 - 1;
				}
			};

			return new Noise(ctx, cfg);
		};

		Noise.Pink = function(ctx) {
			var cfg = {};
			cfg.onaudioprocess = function(e) {
				var b0, b1, b2, b3, b4, b5, b6, output, white, i;
				b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
				output = e.outputBuffer.getChannelData(0);
				white = Math.random() * 2 - 1;

				for(i = 0; i < output.length; i++) {
					b0 = 0.99886 * b0 + white * 0.0555179;
					b1 = 0.99332 * b1 + white * 0.0750759;
					b2 = 0.96900 * b2 + white * 0.1538520;
					b3 = 0.86650 * b3 + white * 0.3104856;
					b4 = 0.55000 * b4 + white * 0.5329522;
					b5 = -0.7616 * b5 - white * 0.0168980;
					output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
					output[i] *= 0.11; // (roughly) compensate for gain
					b6 = white * 0.115926;
				}
			};

			return new Noise(ctx, cfg);
		};

		Noise.Brown = function(ctx) {
			var cfg = {};
			cfg.onaudioprocess = function(e) {
				var output, white, lastOut, i;
				output = e.outputBuffer.getChannelData(0);
				white = Math.random() * 2 - 1;
				lastOut = 0.0;
				for (i = 0; i < output.length; i++) {
					output[i] = (lastOut + (0.02 * white)) / 1.02;
					lastOut = output[i];
					output[i] *= 3.5; // (roughly) compensate for gain
				}
			};

			return new Noise(ctx, cfg);
		};

		return Noise;
	});