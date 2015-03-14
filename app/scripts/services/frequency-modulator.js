'use strict';

angular.module('chunky')
	.factory('FrequencyModulator', function() {
		var FrequencyModulator = function FrequencyModulator(ctx, cfg) {
			// Keep ctx :)
			this.ctx = ctx;

			// Node setup
			this.modulator = this.ctx.createOscillator();
			this.amplifier = this.ctx.createGain();
			this.output = this.ctx.createGain();

			cfg = cfg || {};

			this.type = cfg.type || this.params.type.defaultValue;
			this.gain = cfg.gain || this.params.gain.defaultValue;
			this.frequency = cfg.frequency || this.params.frequency.defaultValue;
			// Node routing
			this.modulator.connect(this.amplifier);
			//this.amplifier.connect(this.output);
		};

		FrequencyModulator.prototype = Object.create(null, {
			// I keep repeating this... I should extend from a base class.. roll on ecmaScript6!
			// Or I could inject super into here instead of null but... I think thats ugly :)
			connect: {
				value: function(target) {
					this.amplifier.connect(target.input ? target.input : target);
					this.modulator.start(0);
				}
			},
			disconnect: {
				value: function() {
					this.amplifier.disconnect();
				}
			},
			params: {
				value: {
					type: {
						type: 'enum',
						_enum: ['sine', 'saw', 'square', 'triangle'],
						defaultValue: 'sine'
					},
					gain: {
						type: 'float',
						min: 0,
						max: 70,
						defaultValue: 30
					},
					frequency: {
						type: 'float',
						min: 0,
						max: 10000,
						defaultValue: 400
					}
				}
			},
			type: {
				enumerable: true,
				get: function() {
					return this.modulator.type;
				},
				set: function(type) {
					this.modulator.type = type;
				}
			},
			gain: {
				enumerable: true,
				get: function() {
					return this.amplifier.gain.value;
				},
				set: function(gain) {
					this.amplifier.gain.setValueAtTime(gain, 0);
				}
			},
			frequency: {
				enumerable: true,
				get: function() {
					return this.modulator.frequency.value;
				},
				set: function(frequency) {
					this.modulator.frequency.setValueAtTime(frequency, 0);
				}
			},
			cfg: {
				get: function() {
					return {
						type: this.type,
						gain: this.gain,
						frequency: this.frequency
					};
				},
				set: function(cfg) {
					this.type = cfg.type || this.type;
					this.gain = cfg.gain || this.gain;
					this.frequency = cfg.frequency || this.frequency;
				}
			}
		});

		return FrequencyModulator;
	});