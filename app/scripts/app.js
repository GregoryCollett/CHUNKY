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
      this.sampleRate = 2048;
      this.osc1 = new Oscillator(this.ctx, 'sawtooth', 4, 0, -10);
      this.osc2 = new Oscillator(this.ctx, 'sawtooth', 3, 0, 10);
      this.osc3 = new Oscillator(this.ctx, 'square', 1, 0);
      this.noise = new Noise(this.ctx);
      this.vcf = new Filter(this.ctx, {type:'bandpass'});
      this.vcf2 = new Filter(this.ctx, {type:'highpass'});
      this.vcfEnvelope = new Envelope(this.ctx);
      this.vcaEnvelope = new Envelope(this.ctx);
      this.env1 = new Envelope(this.ctx);
      this.env2 = new Envelope(this.ctx);
      this.lfo = new LFO(this.ctx, {
        target:this.vcf.frequency, 
        callback: function(param, value) {
          param.value = value;
        }
      });
      this.distortion = new Distortion(this.ctx);
      this.reverb = new Reverb(this.ctx);
      this.master = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();

      this.oscs = [this.osc1, this.osc2, this.osc3];
      this.envelopes = [this.vcfEnvelope, this.vcaEnvelope, this.env1, this.env2];

      this.vcf.input.gain.value = 0.5;
      this.vcf2.input.gain.value = 0.5;
      this._vcfmix = 0.5;
      this.analyser.fftSize = 2048;

      this.master.gain.value = 1;
      
      // Synth Routing (make this dynamic in the future) :D
      //Connect up param controllers
      //this.lfo.connect(this.vcf2._filter, 'frequency');
      this.vcfEnvelope.connect(this.vcf, ['_filter', 'frequency']);
      this.vcfEnvelope.connect(this.vcf2, ['_filter','frequency']);
      this.vcaEnvelope.connect(this.master, 'gain');

      angular.forEach(this.oscs, function(osc) {
        osc.connect(self.vcf.input);
        osc.connect(self.vcf2.input);
      });
      this.noise.connect(this.vcf.input);
      this.noise.connect(this.vcf2.input);
      this.vcf.connect(this.distortion.input);
      this.vcf2.connect(this.distortion.input);
      this.distortion.connect(this.reverb);
      this.reverb.connect(this.master);
      this.master.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      
      this.init();
    };
    
    Chunky.prototype = Object.create(null, {
      init: {
        value: function() {
          angular.forEach(this.oscs, function(osc) {
            osc.init();
          });
          return this;
        }
      },
      play: {
        value: function() {
          this.vcfEnvelope.triggerOn();
          this.vcaEnvelope.triggerOn();
          this.noise.start();
          angular.forEach(this.oscs, function(osc) {
            osc.start();
          });
          return this;
        }
      },
      playNote: {
        value: function(freq) {
          this.vcfEnvelope.triggerOn();
          this.vcaEnvelope.triggerOn();
          this.noise.start();
          angular.forEach(this.oscs, function(osc) {
            osc.frequency = freq;
            osc.start();
          });
          return this;
        }
      },
      stop: {
        value: function() {
          var self = this;
          this.vcfEnvelope.triggerOff();
          this.vcaEnvelope.triggerOff();
          this.noise.stop();
          angular.forEach(this.oscs, function(osc) {
            osc.stop();
          });
          return this;
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
      }
    });

    return new Chunky(audioCtx);
  })
  .controller('chunkyController', function($scope, chunkySynth) {
    // Set synth to scope so we can bind params and make noises :D
    $scope.chunky = chunkySynth;

    // Setup Keyboard Callbacks
    $scope.keyboard = {
      keydown: function(note, frequency) {
        $scope.chunky.playNote(frequency);
      },
      keyup: function(note, frequency) {
        $scope.chunky.stop();
      }
    };
  }); 