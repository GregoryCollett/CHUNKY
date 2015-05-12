'use strict';

angular.module('chunky')
  .service('chunkySynth', function(
    $window,
    localStorageService,
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
      // Store the audio context
      this.ctx = ctx;

      // Load default patches
      this.patches = Patches;

      // Set some defaults up
      this.polyphony = true;
      this._glide = {enabled: true, amount: 0};
      this._voices = {};
      this.sampleRate = 2048;

      // setup all possible audio nodes
      // setup oscillators
      this.osc1 = new Oscillator(this.ctx, {shape: 'sawtooth', octave: 4, detune:-10});
      this.osc2 = new Oscillator(this.ctx, {shape: 'sawtooth', octave: 3, detune: 10});
      this.osc3 = new Oscillator(this.ctx, {shape: 'square', octave: 1});

      // setup noise oscillator
      this.noise = new Noise(this.ctx);
      
      // setup filters
      this.vcf = new Filter(this.ctx, {type:'bandpass'});
      this.vcf2 = new Filter(this.ctx, {type:'highpass'});
      
      // setup envelopes
      this.vcfEnvelope = new Envelope(this.ctx);
      this.vcaEnvelope = new Envelope(this.ctx);
      this.env1 = new Envelope(this.ctx);
      this.env2 = new Envelope(this.ctx);
      
      // setup low frequency oscillators
      this.lfo1 = new LFO(this.ctx);
      this.lfo2 = new LFO(this.ctx);
      
      // setup effects
      // setup distortion
      this.distortion = new Distortion(this.ctx);
      
      // setup reverb
      this.reverb = new Reverb(this.ctx);
      
      // setup master gain
      this.master = this.ctx.createGain();
      
      // setup final equalizer
      this.equalizer = new Equalizer(this.ctx);
      
      // create an analyser to be used by oscilloscope/s
      this.analyser = this.ctx.createAnalyser();

      // make life easier
      this.oscs = [this.osc1, this.osc2, this.osc3, this.noise];
      this.filters = [this.vcf, this.vcf2];
      this.envelopes = [this.vcfEnvelope, this.vcaEnvelope, this.env1, this.env2];
      this.lfos = [this.lfo1, this.lfo2];

      // basic config
      this.vcfMix = 0.5;
      this.analyser.fftSize = 1024;
      this.master.gain.value = 1;
      this.tempo = 175;

      // Synth Routing (make this dynamic in the future) :D
      // in future version we will setup routing based on users config :D
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
      // connect filter one to vcf envelope
      this.vcfEnvelope.connect(this.vcf, ['_filter', 'frequency']);

      // connect filter two to vcf envelope
      this.vcfEnvelope.connect(this.vcf2, ['_filter','frequency']);
      
      // connect amplifier to vca envelope
      this.vcaEnvelope.connect(this.master, 'gain', {range:[0, 2]});
      
      // connect lfo to filter 1 & 2...
      this.lfo1.connect(this.vcf._filter.frequency);
      this.lfo1.connect(this.vcf2._filter.frequency);
    };
    
    Chunky.prototype = Object.create(null, {
      // play a note based on frequency, note is stored for use as a key
      playNote: {
        value: function(note, freq) {
          var i,
              params,
              now = this.ctx.currentTime;

          // add pressed note to voices;
          this._voices[note] = freq;

          // create the params object to be passed across to the oscillator
          params = {note:note, frequency:freq, now: this.ctx.currentTime};

          // if chunky has glide enabled
          if (this.glide) {
            // then add the glide parameter with an amount to the param object
            params.glide = this.glideAmount;
          }

          // for each envelope
          for (i = 0; i < this.envelopes.length; i++) {
            if (!this.polyphony || !this.envelopes[i].reTrigger && Object.keys(this._voices).length === 1 || this.envelopes[i].reTrigger) {
              // trigger envelope/gate on
              this.envelopes[i].triggerOn(now);
            }
          }

          // for each oscillator
          for(i = 0; i < this.oscs.length; i++) {
            // if chunky not polyphony
            if (!this.polyphony) {
              // for each voice tracked by chunky
              for (var voice in this._voices) {
                // if the note not the same as current note
                if (voice !== note) {
                  // stop the note from playing
                  this.stop(voice);
                }
              }
            }
            // play note with the given parameters
            this.oscs[i].start(params);
          }
        }
      },
      // stop note from playing
      stop: {
        value: function(note, freq) {
          var i,
              now = this.ctx.currentTime;

          // if this voices contains the current note
          if (this._voices[note]) {
            // delete the note from the voices object
            delete this._voices[note];

            // for each envelope
            for (i = 0; i < this.envelopes.length; i++) {
              // if more than one voice
              if (Object.keys(this._voices).length <= 1) {
                // trigger release of envelope/gate
                //this.envelopes[i].triggerOff(now);
              }
            }

            // for each oscillator/noise generator
            for(i = 0; i < this.oscs.length; i++) {
              // if it is an oscillator
              if (this.oscs[i] instanceof Oscillator) {
                // stop the oscillator from playing
                this.oscs[i].stop(note, freq);
              } else {
                // else its a noise generator
                // if voices still more than one
                if (Object.keys(this._voices).length < 1) {
                  // stop the noise generator
                  this.oscs[i].stop(note, freq);
                }
              }
            }
          }
        }
      },
      // keeps track of the current patch in use
      currentPatch: {
      	get: function() {
      		return this._currentPatch;
      	},
      	set: function(patch) {
      		this._currentPatch = patch;
      		this.loadPatch(patch);
      	}
      },
      // loads a patch/maintains patch configuration throughout chunky
      loadPatch: {
        value: function(patch) {
  			  var i ;
          // reinit settings held in chunky
          this.polyphony = patch.polyphony;
          this._glide = patch.glide;
          this.masterGain = patch.master;

          // reinit each oscillator/noise generator with new cfg
    			for (i = 0; i < this.oscs.length; i++) {
    				if (this.oscs[i] instanceof Oscillator) {
    				  this.oscs[i].cfg = patch.oscillators[i];
    				} else {
    				  patch.noise = this.oscs[i].cfg;
    				}
    			}

          // reinitialise noise with new cfg
    			this.noise.cfg = patch.noise;

          // reinitialise vcf mix with new val
    			this.vcfMix = patch.vcfMix;

          // reinitialise each filter with new cfg
    			for (i = 0; i < this.filters.length; i++) {
    				this.filters[i].cfg = patch.filters[i];
    			}

          // reinit each envelope with new cfg
    			for (i = 0; i < this.envelopes.length; i++) {
    				this.envelopes[i].cfg = patch.envelopes[i];				
    			}

          // reinit each lfo with new cfg
    			for (i = 0; i < this.lfos.length; i++) {
    				this.lfos[i].cfg = patch.lfos[i];
    			}

          // reinit distortion with new cfg
    			this.distortion.cfg = patch.distortion;

          // reinit reverb with new cfg
    			this.reverb.cfg = patch.reverb;

          // reinit equalizer with new cfg
          this.equalizer.cfg = patch.cfg;
        }
      },
      savePatch: {
        value: function() {
          // setup the default patch object (we could make this a proper object but wah da hek)
          var patch = {
            oscillators: [],
            noise: {},
            filters: [],
            vcfMix: this.vcfMix,
            envelopes: [],
            lfos: [],
            distortion: this.distortion.cfg,
            reverb: this.reverb.cfg,
            equalizer: this.equalizer.cfg,
            polyphony: this.polyphony,
            glide: this._glide,
            master: this.masterGain
          },
          i;

          // ask user for a patch
          patch.name = $window.prompt('Please enter a name for your new patch');

          // save config for each oscillator and noise
          for (i = 0; i < this.oscs.length; i++) {
            if (this.oscs[i] instanceof Oscillator) {
              patch.oscillators.push(this.oscs[i].cfg);
            } else {
              patch.noise = this.oscs[i].cfg;
            }
          }

          // save config for each filter
          for (i = 0; i < this.filters.length; i++) {
            patch.filters.push(this.filters[i].cfg);
          }

          // save config for each envelope
          for (i = 0; i < this.envelopes.length; i++) {
            patch.envelopes.push(this.envelopes[i].cfg);
          }

          // save config for each lfo
          for (i = 0; i < this.lfos.length; i++) {
            patch.lfos.push(this.lfos[i].cfg);
          }

          // save patch to local storage
          localStorageService.set(patch.name, patch);

          // return the patch
          return patch;
        }
      },
      // tempo used for items such as lfo sync
      tempo: {
        get: function() {
          return this.ctx.tempo;
        },
        set: function(tempo) {
          this.ctx.tempo = tempo;
        }
      },
      // vcf mix used to set the crossfade mix for filters
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
      // final output level
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
      // oscillator glide toggle
      glide: {
        enumberable: true,
        get: function() {
          return this._glide.enabled;
        },
        set: function(glide) {
          this._glide.enabled = glide;
        }
      },
      // oscillator glide amount - only used when this.glide = true;
      glideAmount: {
        enumberable: true,
        get: function() {
          return this._glide.amount;
        },
        set: function(amount) {
          this._glide.amount = amount;
        }
      },
      // polyphony - can more than one note be played at a time
      polyphony: {
        enumberable: true,
        get: function() {
          return this._polyphony;
        },
        set: function(polyphony) {
          this._polyphony = polyphony;
        }
      },
      // number of voices in use
      voices: {
        get: function() {
          return Object.keys(this._voices).length;
        },
        set: function() {
          return;
        }
      }
    });
  
    // I bet there is an angular function that can do this
    Chunky.isEmpty = function(obj) {
      return Object.keys(obj).length === 0;
    };

    // Create a chunky singleton service as it will only be required and newable once.
    // Maybe I should put object into factory and instantiate the object in this service..
    return new Chunky(audioCtx);
  });