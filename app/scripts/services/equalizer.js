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
			this.midShelf = this.ctx.createBiquadFilter();
			this.midShelf.type = 'peaking';
			this.highShelf = this.ctx.createBiquadFilter();
			this.highShelf.type = 'highshelf';

			this.registerBand(this.lowShelf);
			this.registerBand(this.midShelf);
			this.registerBand(this.highShelf);

			this.input.connect(this.lowShelf);
			this.lowShelf.connect(this.midShelf);
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
			registerBand: {
				value: function(band) {
					this.bands.push(band);
				}
			},
		});

		return Equalizer;
	});