'use strict';

angular.module('chunky')
  .factory('Oscillator', function() {
    //var Oscillator = function Oscillator(ctx, cfg) {
    var Oscillator = function Oscillator(ctx, shape, octave, frequency, detune) {
      this.ctx = ctx;
      
      this.osc = ctx.createOscillator();
      this.controlNode = ctx.createGain();
      this.node = this.ctx.createGain();
      this.output = ctx.createGain();
      
      this._frequencyKey = frequency || 55;
      this._octave = octave || 2;
      this._fine = detune || 0;
      this._frequency = Math.pow(2, this._octave * this.frequencyKey);
      this.osc.type = shape;
      this.osc.frequency.value = this._frequency;
      this.osc.detune.value = this._fine;
      
      this.controlNode.gain.value = 0.5;
      this.node.gain.value = 0;
      this.output.gain.value = 0;
      
      this.osc.connect(this.controlNode);
      this.controlNode.connect(this.node);
      this.node.connect(this.output);
      
      this._enabled = false;
    };
    
    Oscillator.prototype = Object.create(null, {
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
      init: {
        value: function() {
          this.osc.start(0);
        }
      },
      start: {
        value: function() {
          var now = this.ctx.currentTime;
          this.output.gain.setValueAtTime(1, now);
          return this;
        }
      },
      stop: {
        value: function(release) {
          release = release || 0;
          var now = this.ctx.currentTime;
          this.output.gain.setValueAtTime(0, now + release);
          return this;
        }
      },
      frequency: {
        enumerable: true,
        get: function() {
          return this.osc.frequency.value;
        },
        set: function(frequency) {
          this._frequencyKey = frequency;
          this._frequency = Math.pow(2, this.octave) * this._frequencyKey;
          this.osc.frequency.setValueAtTime(this._frequency, 0);
        }
      },
      octave: {
        enumerable: true,
        get: function() {
          return this._octave;
        },
        set: function(octave) {
          this._octave = octave;
        }
      },
      fine: {
        enumerable: true,
        get: function() {
          return this._fine;
        },
        set: function(fine) {
          this._fine = fine;
          this.osc.detune.setValueAtTime(this._fine, 0);
        }
      },
      gain: {
        enumerable: true,
        get: function() {
          return this.controlNode.gain.value;
        },
        set: function(gain) {
          this.controlNode.gain.setValueAtTime(gain, 0);
        }
      },
      enabled: {
        enumerable: true,
        get: function() {
          return this._enabled;
        },
        set: function(enabled) {
          this._enabled = enabled;
          if (this._enabled) {
            this.node.gain.setValueAtTime(1, 0);
          } else {
            this.node.gain.setValueAtTime(0, 0);
          }
        }
      }
    });
  
    return Oscillator;
  });
