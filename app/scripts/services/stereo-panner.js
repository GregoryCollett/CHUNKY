'use strict';

angular.module('chunky')
	.factory('StereoPanner', function() {
		var StereoPanner = function StereoPanner(ctx) {
			this.ctx = ctx;

			this.input = this.ctx.createGain();
			this.splitter = this.ctx.createChannelSplitter(2);
			this.gainL = this.ctx.createGain();
			this.gainR = this.ctx.createGain();
			this.merger = this.ctx.createChannelMerger(2);
			this.compressor = this.ctx.createDynamicsCompressor();
			this.output = this.ctx.createGain();

			this.input.connect(this.splitter);
			this.splitter.connect(this.gainL);
			this.splitter.connect(this.gainR);
			this.gainL.connect(this.merger);
			this.gainR.connect(this.merger);

			this.merger.connect(this.compressor);

			this.compressor.connect(this.output);
		};

		StereoPanner.prototype = Object.create(null, {
			connect: {
				value: function(target) {
					this.output.connect(target.input ? target.input : target);
				}
			},
			pan: {
				enumberable: true,
				get: function() {
					return;
				},
				set: function(pan) {
					this.gainL = pan;
					this.gainR = pan;
				}
			}
		});

		return StereoPanner;
	});