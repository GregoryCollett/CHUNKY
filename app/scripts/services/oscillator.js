'use strict';

angular.module('chunky')
  .factory('Oscillator', function(FrequencyModulator) {
    var isEmpty = function(obj) {
      return Object.keys(obj).length === 0;
    };
    //var Oscillator = function Oscillator(ctx, cfg) {
    var Oscillator = function Oscillator(ctx, cfg) {
      cfg = cfg || {fm:{type:'sine', gain: 300, frequency: 400}};

      this.ctx = ctx;
      this.type = 'oscillator';

      this.voices = {};
      this._fm = cfg.fm || {enabled: false, type:'sine', gain: 300, frequency: 400};

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
      // this method should also take a velocity going forward
      start: {
        value: function(cfg) {
          this.frequency = cfg.frequency;
          
          this._fm.frequency = this.frequency * 2;
          var fm = new FrequencyModulator(this.ctx, this._fm);
          var osc = this.ctx.createOscillator();

          osc.fm = fm;
          osc.type = this.shape;
          osc.frequency.setValueAtTime(this.frequency, cfg.now);
          osc.detune.setValueAtTime(this.fine, cfg.now);

          if (this._fm.enabled) {
            fm.connect(osc.frequency);
          }
          osc.connect(this.controlNode);
          osc.start(0);

          this.voices[cfg.note] = osc;

          if (cfg.glide && this._lastFrequency) {
            osc.frequency.setValueAtTime(this._lastFrequency, cfg.now);
            osc.fm.modulator.frequency.setValueAtTime(this._lastFrequency * 2, cfg.now);
            osc.frequency.linearRampToValueAtTime(this.frequency, cfg.now + cfg.glide);
            osc.fm.modulator.frequency.linearRampToValueAtTime(this._fm.frequency, cfg.now + cfg.glide);
          }

          this.output.gain.setValueAtTime(1, cfg.now);

          this._lastFrequency = this.frequency;
        }
      },
      stop: {
        value: function(note, freq) {
          this.voices[note].fm.disconnect();
          this.voices[note].disconnect();

          delete this.voices[note];

          if (isEmpty(this.voices)) {
            this.output.gain.setValueAtTime(0, 0);
          }

          return this;
        }
      },
      // this method should change to make changes directly to the generator
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
      },
      fmType: {
        enumerable: true,
        get: function() {
          return this._fm.type;
        },
        set: function(type) {
          this._fm.type = type;
          for(var voice in this.voices) {
            if (this.voices[voice].fm) {
              this.voices[voice].fm.type = this._fm.type;
            }
          }
        }
      },
      fmGain: {
        enumerable: true,
        get: function() {
          return this._fm.gain;
        },
        set: function(gain) {
          this._fm.gain = gain;
          for(var voice in this.voices) {
            this.voices[voice].fm.gain = this._fm.gain;
          }
        }
      },
      fmFrequency: {
        enumerable: true,
        get: function() {
          return this._fm.frequency;
        },
        set: function(frequency) {
          this._fm.frequency = frequency;
          for(var voice in this.voices) {
            this.voices[voice].fm.frequency = this.voices[voice].frequency + this._fm.frequency;
          }
        }
      },
      cfg: {
        get: function() {
          return {
            enabled: this.enabled,
            shape: this.shape,
            octave: this.octave,
            fine: this.fine,
            gain: this.gain,
            fm: this._fm,
          };
        },
        set: function(cfg) {
          this.enabled = cfg.enabled;
          this.shape = cfg.shape;
          this.octave = cfg.octave;
          this.fine = cfg.fine;
          this.gain = cfg.gain;
        }
      }
    });
  
    return Oscillator;
  });
