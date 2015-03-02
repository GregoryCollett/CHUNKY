'use strict';

angular.module('chunky')
	.factory('Chorus', function(LFO) {
		var Chorus = function Chorus(ctx, cfg) {
			// Setup default config
			cfg = cfg || {};

			// Link AudioContext
			this.ctx = ctx;

			// Create relevant nodes
			this.input = this.ctx.createGain();
			this.splitter = this.ctx.createSplitter(2);
			this.delayL = this.ctx.createDelay();
			this.delayR = this.ctx.createDelay();
			this.feedbackGainLR = this.ctx.createGain();
			this.feedbackGainRL = this.ctx.createGain();
			this.merger = this.ctx.createChannelMerger(2);
			this.output = this.ctx.createGain();
			this.lfoL = new LFO(this.ctx, {});
			this.lfoR = new LFO(this.ctx, {});

			// Route nodes together
			this.input.connect(this.attenuator);
			this.attenuator.connect(this.output);
			this.attenuator.connect(this.splitter);
			this.splitter.connect(this.delayL, 0);
			this.splitter.connect(this.delayR, 1);
			this.delayL.connect(this.feedbackGainLR);
			this.delayR.connect(this.feedbackGainRL);
			this.feedbackGainLR.connect(this.delayR);
			this.feedbackGainRL.connect(this.delayL);
			this.delayL.connect(this.merger, 0, 0);
			this.delayR.connect(this.merger, 0, 1);
			this.merger.connect(this.output);

			// Setup defaults :D
		};

		Chorus.prototype = Object.create(null, {
			connect: {
				value: function(target) {
					this.output.connect(target.input ? target.input : target);
				}
			},
			disconnect: {
				value: function() {
					this.output.disconnect();
				}
			},
			params:{
				value: {
					delay: {},
					depth: {},
					feedback: {},
					rate: {},
				}
			},
			delay: {
				enumerable: true,
				get: function() {
					return this._delay;
				},
				set: function(delay) {
					this._delay = 0.0002 * (Math.pow(10, delay) * 2);
					this.lfoL.offset = this._delay;
					this.lfoR.offset = this._delay;
				}
			},
			depth: {
				enumerable: true,
				get: function() {
					return this._depth;
				},
				set: function(depth) {
					this._depth = depth;
					this.lfoL.oscillation = this._depth * this._delay;
					this.lfoR.oscillation = this._depth * this._delay;
				}
			},
			feedback: {
				enumberable: true,
				get: function() {
					return this._feedback;
				},
				set: function(feedback) {
					this._feedback = feedback;
					this.feedbackGainLR = this._feedback;
					this.feedbackGainRL = this._feedback;
				}
			},
			rate: {
				enumerable: true,
				get: function() {
					return this._rate;
				},
				set: function(rate) {
					this._rate = rate;
					this.lfoL.frequency = this._rate;
					this.lfoR.frequency = this._rate;
				}
			}
		});

		return Chorus;
	});