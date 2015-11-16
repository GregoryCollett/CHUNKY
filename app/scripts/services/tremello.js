'use strict';

angular.module('chunky')
	.factory('Tremello', function(LFO) {
		var Tremello = function Tremello(ctx, cfg) {
			this.ctx = ctx;

			cfg = cfg || {};

			this.input = this.ctx.createGain();
			this.output = this.ctx.createGain();
			this.modulator = new LFO();
		};

		Tremello.prototype = Object.create(null, {
			connect: {
				value: function(target) {
					this.output.connect(target.input ? target.input : target);
				}
			},
			disconnect: {
				value: function() {
					this.output.disconnect();
				}
			}
		});
	});
