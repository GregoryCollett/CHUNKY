'use strict';

angular.module('chunky')
	.service('Patches', function() {
		var Patches = function Patches() {
			this.list = [
				{
					name: 'init',
					oscillators: [
						{ enabled: true, shape: 'sine', octave: 4, fine: 0, gain: 0.7 },
						{ enabled: true, shape: 'sine', octave: 3, fine: 0, gain: 0.9 },
						{ enabled: true, shape: 'sine', octave: 2, fine: 0, gain: 0.2 },
					],
					vcfMix: 0.5,
					filters: [
						{ enabled: true, type: 'lowpass', frequency: 500, resonance: 2, gain: 1},
						{ enabled: false, type: 'bandpass', frequency: 500, resonance: 2, gain: 1},
					],
					envelopes: [
						// vcf
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 },
						// vca
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 },
						//misc
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 },
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 }
					],
					lfos: [
						{},
						{}
					],
					distortion: { enabled: false, preBand: 0, colour: 0, drive: 0, postCut: 0 },
					reverb: { enabled: false, seconds: 1, decay: 0.3 }
				},
				{
					name: 'sub',
					oscillators: [
						{ enabled: true, shape: 'sine', octave: 1, fine: 0, gain: 0.7 },
						{ enabled: false, shape: 'sine', octave: 3, fine: 0, gain: 0.9 },
						{ enabled: false, shape: 'sine', octave: 2, fine: 0, gain: 0.2 },
					],
					vcfMix: 1,
					filters: [
						{ enabled: true, type: 'lowpass', frequency: 80, resonance: 2, gain: 1},
						{ enabled: false, type: 'bandpass', frequency: 500, resonance: 2, gain: 1},
					],
					envelopes: [
						// vcf
						{ attack: 0.000002, decay: 0.000002, inverted: true, reTrigger: false, release: 0.02, sustain: 1 },
						// vca
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 },
						//misc
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 },
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 }
					],
					lfos: [
						{},
						{}
					],
					distortion: { enabled: false, preBand: 0, colour: 0, drive: 0, postCut: 0 },
					reverb: { enabled: false, seconds: 1, decay: 0.3 }
				},
				{
					name: 'sub backed',
					oscillators: [
						{ enabled: true, shape: 'sine', octave: 1, fine: 0, gain: 0.7 },
						{ enabled: true, shape: 'sine', octave: 3, fine: 0, gain: 0.9 },
						{ enabled: true, shape: 'sine', octave: 2, fine: 0, gain: 0.2 },
					],
					vcfMix: 1,
					filters: [
						{ enabled: true, type: 'lowpass', frequency: 80, resonance: 2, gain: 1},
						{ enabled: false, type: 'bandpass', frequency: 500, resonance: 2, gain: 1},
					],
					envelopes: [
						// vcf
						{ attack: 0.000002, decay: 0.000002, inverted: true, reTrigger: false, release: 0.02, sustain: 1 },
						// vca
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 },
						//misc
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 },
						{ attack: 0.02, decay: 0.1, inverted: false, reTrigger: false, release: 0.02, sustain: 1 }
					],
					lfos: [
						{},
						{}
					],
					distortion: { enabled: false, preBand: 0, colour: 0, drive: 0, postCut: 0 },
					reverb: { enabled: false, seconds: 1, decay: 0.3 }
				},
			];

			this.sync();
		};

		Patches.prototype = Object.create(null, {
			register: {
				value: function(patch) {
					this.list.push(patch);
				}
			},
			// Sync patches stored in web storage :)
			sync: {
				value: function() {
					//for each patch in local storage...
				}
			},
			_lookup: {
				value: function() {
					var lookup = [],
						i;

					for (i = 0; i < this.list.length; i++) {
						lookup.push({id: i, name: this.list[i].name });
					}

					return lookup;
				}
			},
			lookup: {
				get: function() {
					return this._lookup();
				}
			}
		});

		return new Patches();
	});