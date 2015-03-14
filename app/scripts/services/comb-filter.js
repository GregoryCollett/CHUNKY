'use strict';

angular.module('chunky')
	.factory('CombFilter', function() {
		var CombFilter = function CombFilter(ctx, cfg) {
			this.ctx = ctx;

			this.input = this.ctx.createGain();
			this._delay = this.ctx.createDelay();
			this._damping = this.ctx.createGain();
			this._filter = this.ctx.createBiquadFilter();
			this._feedback = this.ctx.createGain();
			this.output = this.ctx.createGain();

			cfg = cfg || {};

			this.delay = cfg.delay || this.params.delay.defaultValue;
			this.feedback = cfg.feedback || this.params.feedback.defaultValue;
			this.damping = cfg.damping || this.params.damping.defaultValue;
			this.cuttoff = cfg.cuttoff || this.params.cuttoff.defaultValue;

			this.input.connect(this._delay);
			this._delay.connect(this._damping);
			this._damping.connect(this._filter);
			this._filter.connect(this._feedback);
			this._feedback.connect(this.input);
			this._damping.connect(this.output);

		};

		CombFilter.prototype = Object.create(null, {
			params: {
				value: {
					delay: {
						label: 'DLY',
						name: 'delay',
						min: 0,
						max: 3,
						defaultValue: 0.027,
						step: 0.001
					},
					feedback: {
						label: 'FDBK',
						name: 'feedback',
						min: 0,
						max: 1,
						defaultValue: 0.84,
						step: 0.1
					},
					damping: {
						label: 'DMP',
						name: 'damping',
						min: 0,
						max: 1,
						defaultValue: 0.52,
						step: 0.01
					},
					cuttoff: {
						label: 'DLY',
						name: 'delay',
						min: 0,
						max: 22050,
						defaultValue: 3000,
						step: 1
					}
				}
			},
			delay: {
				enumerable: true,
				get: function() {
					return this._delay.delayTime.value;
				},
				set: function(delay) {
					this._delay.delayTime.setValueAtTime(delay, 0);
				}
			},
			feedback: {
				enumerable: true,
				get: function() {
					return this._feedback.gain.value;
				},
				set: function(feedback) {
					this._feedback.gain.setValueAtTime(feedback, 0);
				}
			},
			damping: {
				enumerable: true,
				get: function() {
					return this._damping.gain.value;
				},
				set: function(damping) {
					this._damping.gain.setValueAtTime(damping, 0);
				}
			},
			cuttoff: {
				enumerable: true,
				get: function() {
					return this._filter.frequency.value;
				},
				set: function(cuttoff) {
					this._filter.frequency.setValueAtTime(cuttoff, 0);
				}
			},
			connect: {
				value: function(target) {
					this.output.connect(target.input ? target.input : target);
				}
			}
		});

		return CombFilter;
	});