'use strict';

angular.module('chunky')
	.factory('BitCrusher', function() {
		var BitCrusher = function BitCrusher(ctx, cfg) {
			cfg = cfg || {};
			this.ctx = ctx;

			this.output = this.ctx.createGain();
			this.input = this.ctx.createAudioWorker('scripts/services/bitcrusher-worker.js', 1, 1);
			this.input.addParameter('bits', cfg.bits || this.params.bits.defaultValue);
			this.input.addParameter('frequencyReduction', cfg.frequencyReduction || this.params.frequencyReduction.defaultValue);
			
			this.input.connect(this.output);
		};

		BitCrusher.prototype = Object.create(null, {
			params: {
				value: {
					bits: {
						name: 'bits',
						labels: 'BITS',
						min: 1,
						max: 512,
						defaultValue: 512,
						type: 'float'
					},
					frequencyReduction: {
						name: 'frequencyReduction',
						label: 'FR',
						min: 0,
						max: 1,
						defaultValue: 0.9,
						type: 'float'
					}
				}
			},
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
			bits: {
				enumerable: true,
				get: function() {
					return this.worker.bits.value;
				},
				set: function(bits) {
					this.worker.bits.value = bits;
				}
			},
			frequencyReduction: {
				enumerable: true,
				get: function() {
					return this.worker.frequencyReduction.value;
				},
				set: function(fr) {
					this.worker.frequencyReduction.value = fr;
				}
			}
		});

		return BitCrusher;
	});