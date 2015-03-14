'use strict';

angular.module('chunky')
	.factory('BitCrusher', function() {
		var BitCrusher = function BitCrusher(ctx, cfg) {
			cfg = cfg || {};
			this.ctx = ctx;

			this.input = this.ctx.createGain();
			this.worker = this.ctx.createAudioWorker('scripts/services/bitcrusher-worker.js', 1, 1);
		};

		BitCrusher.prototype = Object.create(null, {

		});

		return BitCrusher;
	});