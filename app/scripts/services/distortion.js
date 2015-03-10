'use strict';

angular.module('chunky')
  .factory('Distortion', function() {
    var Distortion = function Distortion(ctx) {
      this.ctx = ctx;
      
      this.input = this.ctx.createGain();
      this.output = this.ctx.createGain();
      
      this.wet = this.ctx.createGain();
      this.wet.gain.value = 0;
      this.dry = this.ctx.createGain();
      this.dry.gain.value = 1;
      
      this.bandpass = this.ctx.createBiquadFilter();
      this.bandpassWet = this.ctx.createGain();
      this.bandpassDry = this.ctx.createGain();
      
      this.waveShaper = this.ctx.createWaveShaper();
      
      this.lowpass = this.ctx.createBiquadFilter();
      
      this.input.connect(this.dry);
      this.input.connect(this.wet);
      this.wet.connect(this.bandpass);
      this.bandpass.connect(this.bandpassWet);
      this.bandpass.connect(this.bandpassDry);
      this.bandpassWet.connect(this.waveShaper);
      this.bandpassDry.connect(this.waveShaper);
      this.waveShaper.connect(this.lowpass);
      this.dry.connect(this.output);
      this.lowpass.connect(this.output);
      
      this.bandpass.frequency.value = 800;
      this.bandpassWet.gain.value = 0.5;
      this.lowpass.frequency.value = 3000;
      this._drive = 0.5;
      this.bandpassDry.gain.value = 0.5;
      
      this.enabled = false;
    };
    
    Distortion.prototype = Object.create(null, {
      meta: {
        value: {
          params: {
            preBand: {
              min: 0,
              max: 1.0,
              defaultValue: 0.5,
              type: 'float'
            },
            colour: {
              min: 0,
              max: 22050,
              defaultValue: 800,
              type: 'float'
            },
            drive: {
              min: 0.0,
              max: 1.0,
              defaultValue: 0.5,
              type: 'float'
            },
            postCut: {
              min: 0,
              max: 22050,
              defaultValue:3000,
              type: 'float'
            },
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
      preBand: {
        enumerable: true,
        get: function() {
          return this.bandpassWet.gain.value;
        },
        set: function(val) {
          this.bandpassWet.gain.setValueAtTime(val, 0);
          this.bandpassDry.gain.setValueAtTime(1 - val, 0);
        }
      },
      colour: {
        enumerable: true,
        get: function() {
          return this.bandpass.frequency.value;
        },
        set: function(val) {
          this.bandpass.frequency.setValueAtTime(val, 0);
        }
      },
      drive: {
        enumerable: true,
        get: function() {
          return this._drive;
        },
        set: function(val) {
          var k = val * 100,
              n = 22050,
              curve = new Float32Array(n),
              deg = Math.PI / 180,
              i = 0;

          this._drive = val;

          for(i; i < n; i++) {
            var x = i * 2 / n - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
          }
        }
      },
      postCut: {
        enumerable: true,
        get: function() {
          return this.lowpass.frequency.value;
        },
        set: function(val) {
          this.lowpass.frequency.setValueAtTime(val, 0);
        }
      },
      toggleEnabled: {
        value: function() {
          this.enabled = !this.enabled;
          if (this.enabled) {
            this.dry.gain.value = 0.4;
            this.wet.gain.value = 1;
          } else {
            this.dry.gain.value = 1;
            this.wet.gain.value = 0;
          }
        }
      },
      cfg: {
        get: function() {
          return {
            enabled: this.enabled,
            preBand: this.preBand,
            colour: this.colour,
            drive: this.drive,
            postCut: this.postCut
          };
        },
        set: function(cfg) {
          this.enabled = cfg.enabled;
          this.preBand = cfg.preBand;
          this.colour = cfg.colour;
          this.drive = cfg.drive;
          this.postCut = cfg.postCut;
        }
      }
    });
  
    return Distortion;
  });