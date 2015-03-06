'use strict';

angular.module('chunky', ['ngRoute','ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
    })
    .otherwise({
      redirectTo: '/'
    });
  })
  .service('chunkySynth', function(audioCtx, Oscillator, Filter, Envelope, Distortion, Reverb, LFO, Noise) {
    var Chunky = function Chunky(ctx) {
      var self = this;

      this.ctx = ctx;

      this.voices = {};
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
      this.distortion = new Distortion(this.ctx);
      this.reverb = new Reverb(this.ctx);
      this.master = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();

      // make life easier
      this.oscs = [this.osc1, this.osc2, this.osc3, this.noise];
      this.filters = [this.vcf, this.vcf2];
      this.envelopes = [this.vcfEnvelope, this.vcaEnvelope, this.env1, this.env2];

      // basic config
      this.vcfmix = 0.5;
      this.analyser.fftSize = 2048;
      this.master.gain.value = 1;
      
      // Synth Routing (make this dynamic in the future) :D
      for (var i = 0; i < this.oscs.length; i++) {
        this.oscs[i].connect(this.vcf.input);
        this.oscs[i].connect(this.vcf2.input);
      }
      this.vcf.connect(this.distortion.input);
      this.vcf2.connect(this.distortion.input);
      this.distortion.connect(this.reverb);
      this.reverb.connect(this.master);
      this.master.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Link modulators/envelopes
      this.vcfEnvelope.connect(this.vcf, ['_filter', 'frequency']);
      this.vcfEnvelope.connect(this.vcf2, ['_filter','frequency']);
      this.vcaEnvelope.connect(this.master, 'gain');
      this.lfo = new LFO(this.ctx, {
        target: this.vcf2._filter.frequency, 
        callback: function(param, value) {
          param.setValueAtTime(value, 0);
        }
      });
    };
    
    Chunky.prototype = Object.create(null, {
      playNote: {
        value: function(note, freq) {
          var i;

          this.voices[note] = freq;
          
          for (i = 0; i < this.envelopes.length; i++) {
            if (!this.envelopes[i].reTrigger && Object.keys(this.voices).length === 1 || this.envelopes[i].reTrigger) {
              this.envelopes[i].triggerOn();
            }
          }

          for(i = 0; i < this.oscs.length; i++) {
            this.oscs[i].start(note, freq);
          }
        }
      },
      stop: {
        value: function(note, freq) {
          var i;

          delete this.voices[note];

          // for (i = 0; i < this.envelopes.length; i++) {
          //   this.envelopes[i].triggerOff();
          // }

          for(i = 0; i < this.oscs.length; i++) {
            if (this.oscs[i] instanceof Oscillator) {
              this.oscs[i].stop(note, freq);
            } else {
              if (Object.keys(this.voices).length < 1) {
                this.oscs[i].stop(note, freq);
              }
            }
          }
        }
      },
      loadPatch: {
        value: function() {

        }
      },
      savePatch: {
        value: function() {

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
      glide: {
        enumberable: true,
        get: function() {
          return this._glide;
        },
        set: function(glide) {
          this._glide = parseFloat(glide);
        }
      }
    });

    Chunky.isEmpty = function(obj) {
      return Object.keys(obj).length === 0;
    }

    return new Chunky(audioCtx);
  })
  .controller('chunkyController', function($scope, chunkySynth) {
    // Set synth to scope so we can bind params and make noises :D
    $scope.chunky = chunkySynth;

    // Setup Keyboard Callbacks
    $scope.keyboard = {
      keydown: function(note, frequency) {
        $scope.chunky.playNote(note, frequency);
      },
      keyup: function(note, frequency) {
        $scope.chunky.stop(note, frequency);
      }
    };
  }); 