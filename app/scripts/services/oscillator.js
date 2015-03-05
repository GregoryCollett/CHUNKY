'use strict';

angular.module('chunky')
  .factory('Oscillator', function() {
    var isEmpty = function(obj) {
      return Object.keys(obj).length === 0;
    };
    //var Oscillator = function Oscillator(ctx, cfg) {
    var Oscillator = function Oscillator(ctx, cfg) {
      cfg = cfg || {};

      this.ctx = ctx;
      this.type = 'oscillator';

      this.voices = {};

      this.controlNode = ctx.createGain();
      this.node = this.ctx.createGain();
      this.output = ctx.createGain();
      
      this.frequency = cfg.frequency || 55;
      this.octave = cfg.octave || 2;
      this.fine = cfg.detune || 0;
      this.shape = cfg.shape || 'sine';
      
      this.controlNode.gain.value = 0.5;
      this.node.gain.value = 0;
      this.output.gain.value = 0;
      
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
          //this.osc.start(0);
        }
      },
      start: {
        value: function(note, freq) {
          this.frequency = freq;

          var now = this.ctx.currentTime;
          
          var osc = this.ctx.createOscillator();
          osc.type = this.shape;
          osc.frequency.value = this.frequency;
          osc.detune.value = this.fine;
          osc.connect(this.controlNode);
          osc.start(0);

          this.voices[note] = osc;

          this.output.gain.setValueAtTime(1, now);
          return this;
        }
      },
      stop: {
        value: function(note, freq) {
          this.voices[note].disconnect();

          delete this.voices[note];

          if (isEmpty(this.voices)) {
            this.output.gain.setValueAtTime(0, 0);
          }

          return this;
        }
      },
      shape: {
        enumerable: true,
        get: function() {
          return this._shape;
        },
        set: function(shape) {
          this._shape = shape;
        }
      },
      frequency: {
        enumerable: true,
        get: function() {
          return this._frequency;
        },
        set: function(frequency) {
          this._frequencyKey = frequency;
          this._frequency = Math.pow(2, this.octave) * this._frequencyKey;
          //this.osc.frequency.setValueAtTime(this._frequency, 0);
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
          //this.osc.detune.setValueAtTime(this._fine, 0);
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
