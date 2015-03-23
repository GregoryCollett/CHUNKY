'use strict';

angular.module('chunky')
  .service('chunkySynth', function(
    audioCtx, 
    Oscillator, 
    Filter, 
    Envelope, 
    Distortion, 
    Reverb, 
    LFO, 
    Noise, 
    CombFilter, 
    Patches, 
    BitCrusher,
    Equalizer) {
    var Chunky = function Chunky(ctx) {
      var self = this;

      this.ctx = ctx;

      this.patches = Patches;

      this.polyphony = true;

      this._glide = {
        enabled: true,
        amount: 0
      };

      this._voices = {};
      this.sampleRate = 2048;

      // setup nodes
      this.osc1 = new Oscillator(this.ctx, {shape: 'sawtooth', octave: 4, detune:-10});
      this.osc2 = new Oscillator(this.ctx, {shape: 'sawtooth', octave: 3, detune: 10});
      this.osc3 = new Oscillator(this.ctx, {shape: 'square', octave: 1});
      this.noise = new Noise(this.ctx);
      this.vcf = new Filter(this.ctx, {type:'bandpass'});
      this.vcf2 = new Filter(this.ctx, {type:'highpass'});
      this.vcfEnvelope = new Envelope(this.ctx);
      this.vcaEnvelope = new Envelope(this.ctx);
      this.env1 = new Envelope(this.ctx);
      this.env2 = new Envelope(this.ctx);
      this.lfo1 = new LFO(this.ctx);
      this.lfo2 = new LFO(this.ctx);
      this.distortion = new Distortion(this.ctx);
      this.reverb = new Reverb(this.ctx);
      this.master = this.ctx.createGain();
      this.equalizer = new Equalizer(this.ctx);
      this.analyser = this.ctx.createAnalyser();
      

      // make life easier
      this.oscs = [this.osc1, this.osc2, this.osc3, this.noise];
      this.filters = [this.vcf, this.vcf2];
      this.envelopes = [this.vcfEnvelope, this.vcaEnvelope, this.env1, this.env2];
      this.lfos = [];

      // basic config
      this.vcfMix = 0.5;
      this.analyser.fftSize = 1024;
      this.master.gain.value = 1;
      this.tempo = 175;
      this.currentPatch = this.patches.list[0];
      // Synth Routing (make this dynamic in the future) :D
      // in future version we will setup routing based on config :D
      for (var i = 0; i < this.oscs.length; i++) {
        this.oscs[i].connect(this.vcf.input);
        this.oscs[i].connect(this.vcf2.input);
      }
      this.vcf.connect(this.distortion.input);
      this.vcf2.connect(this.distortion.input);
      this.distortion.connect(this.reverb);
      this.reverb.connect(this.master);
      this.master.connect(this.equalizer.input);
      this.equalizer.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Link modulators/envelopes
      this.vcfEnvelope.connect(this.vcf, ['_filter', 'frequency']);
      this.vcfEnvelope.connect(this.vcf2, ['_filter','frequency']);
      this.vcaEnvelope.connect(this.master, 'gain', {range:[0, 2]});
      this.lfo1.connect(this.vcf._filter.frequency);
      this.lfo1.connect(this.vcf2._filter.frequency);

      this.lfos.push(this.lfo1, this.lfo2);
    };
    
    Chunky.prototype = Object.create(null, {
      playNote: {
        value: function(note, freq) {
          var i,
              params,
              now = this.ctx.currentTime;

          this._voices[note] = freq;

          params = {note:note, frequency:freq, now: this.ctx.currentTime};

          if (this.glide) {
            params.glide = this.glideAmount;
          }

          for (i = 0; i < this.envelopes.length; i++) {
            if (!this.polyphony || !this.envelopes[i].reTrigger && Object.keys(this._voices).length === 1 || this.envelopes[i].reTrigger) {
              this.envelopes[i].triggerOn(now);
            }
          }

          for(i = 0; i < this.oscs.length; i++) {
            if (!this.polyphony) {
              for (var voice in this._voices) {
                if (voice !== note) {
                  this.stop(voice);
                }
              }
            }
            this.oscs[i].start(params);
          }
        }
      },
      stop: {
        value: function(note, freq) {
          var i,
              now = this.ctx.currentTime;

          if (this._voices[note]) {
            delete this._voices[note];

            for (i = 0; i < this.envelopes.length; i++) {
              if (Object.keys(this._voices).length <= 1) {
                //this.envelopes[i].triggerOff(now);
              }
            }

            for(i = 0; i < this.oscs.length; i++) {
              if (this.oscs[i] instanceof Oscillator) {
                this.oscs[i].stop(note, freq);
              } else {
                if (Object.keys(this._voices).length < 1) {
                  this.oscs[i].stop(note, freq);
                }
              }
            }
          }
        }
      },
      currentPatch: {
      	get: function() {
      		return this._currentPatch;
      	},
      	set: function(patch) {
      		this._currentPatch = patch;
      		this.loadPatch(patch);
      	}
      },
      loadPatch: {
        value: function(patch) {
  			  var i ;
    			for (i = 0; i < this.oscs.length; i++) {
    				if (this.oscs[i] instanceof Oscillator) {
    				  this.oscs[i].cfg = patch.oscillators[i];
    				} else {
    				  patch.noise = this.oscs[i].cfg;
    				}
    			}

    			this.noise.cfg = patch.noise;

    			this.vcfMix = patch.vcfMix;

    			for (i = 0; i < this.filters.length; i++) {
    				this.filters[i].cfg = patch.filters[i];
    			}

    			for (i = 0; i < this.envelopes.length; i++) {
    				this.envelopes[i].cfg = patch.envelopes[i];				
    			}

    			for (i = 0; i < this.lfos.length; i++) {
    				this.lfos[i].cfg = patch.lfos[i];
    			}

    			this.distortion.cfg = patch.distortion;
    			this.reverb.cfg = patch.reverb;
        }
      },
      savePatch: {
        value: function() {
          var patch = {
            oscillators: [],
            noise: {},
            filters: [],
            vcfMix: this.vcfmix,
            envelopes: [],
            lfos: [],
            distortion: this.distortion.cfg,
            reverb: this.reverb.cfg
          },
          i;

          for (i = 0; i < this.oscs.length; i++) {
            if (this.oscs[i] instanceof Oscillator) {
              patch.oscillators.push(this.oscs[i].cfg);
            } else {
              patch.noise = this.oscs[i].cfg;
            }
          }

          for (i = 0; i < this.filters.length; i++) {
            patch.filters.push(this.filters[i].cfg);
          }

          for (i = 0; i < this.envelopes.length; i++) {
            patch.envelopes.push(this.envelopes[i].cfg);
          }

          for (i = 0; i < this.lfos.length; i++) {
            patch.lfos.push(this.lfos[i].cfg);
          }

          console.log(patch);

          return patch;
        }
      },
      tempo: {
        get: function() {
          return this.ctx.tempo;
        },
        set: function(tempo) {
          this.ctx.tempo = tempo;
        }
      },
      vcfMix: {
        enumberable: true,
        get: function() {
          return this._vcfMix;
        },
        set: function(val) {
          this._vcfMix = val;
          this.vcf.input.gain.value = parseFloat(val);
          this.vcf2.input.gain.value = parseFloat(1 - val);
        }
      },
      masterGain: {
        enumberable: true,
        get: function() {
          return this.master.gain.value;
        },
        set: function(master) {
          this.master.gain.setValueAtTime(master, 0);
          this.master.envelope.range = [0, master];
        }
      },
      glide: {
        enumberable: true,
        get: function() {
          return this._glide.enabled;
        },
        set: function(glide) {
          this._glide.enabled = glide;
        }
      },
      glideAmount: {
        enumberable: true,
        get: function() {
          return this._glide.amount;
        },
        set: function(amount) {
          this._glide.amount = amount;
        }
      },
      polyphony: {
        enumberable: true,
        get: function() {
          return this._polyphony;
        },
        set: function(polyphony) {
          this._polyphony = polyphony;
        }
      },
      voices: {
        get: function() {
          return Object.keys(this._voices).length;
        },
        set: function() {
          return;
        }
      }
    });

    Chunky.isEmpty = function(obj) {
      return Object.keys(obj).length === 0;
    };

    return new Chunky(audioCtx);
  });