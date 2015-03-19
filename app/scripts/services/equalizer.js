'use strict';

angular.module('chunky')
	.factory('Equalizer', function() {
		var Equalizer = function Equalizer(ctx, cfg) {
			this.ctx = ctx;
			this.bands = [];

			this.input = this.ctx.createGain();
			this.output = this.ctx.createGain();

			this.lowShelf = this.ctx.createBiquadFilter();
			this.lowShelf.type = 'lowshelf';
			this.lowShelf.boost = this.ctx.createGainNode();
			this.lowShelf.boost.gain.value = 1;
			this.midShelf = this.ctx.createBiquadFilter();
			this.midShelf.type = 'peaking';
			this.highShelf = this.ctx.createBiquadFilter();
			this.highShelf.type = 'highshelf';

			this.input.connect(this.lowShelf);
			this.lowShelf.connect(this.lowShelf.boost);
			this.lowShelf.boost.connect(this.midShelf);
			this.midShelf.connect(this.highShelf);
			this.highShelf.connect(this.output);
		};

		Equalizer.prototype = Object.create(null, {
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
			lowBoost: {
				get: function() {
					return this.lowShelf.boost.gain.value;
				},
				set: function(bst) {
					this.lowShelf.boost.gain.setValueAtTime(bst, 0);
				}
			},
			low: {
				get: function() {
					return this.lowShelf.gain.value;
				},
				set: function(low) {
					this.lowShelf.gain.setValueAtTime(low, 0);
				}
			},
			mid: {},
			high: {},
		});

		return Equalizer;
	});