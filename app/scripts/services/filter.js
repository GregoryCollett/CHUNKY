'use strict';

angular.module('chunky')
  .factory('Filter', function() {
    var Filter = function Filter(ctx, cfg) {
      this.ctx = ctx;

      this.input = this.ctx.createGain();
      this.output = this.ctx.createGain();

      this._filter = this.ctx.createBiquadFilter();
      
      this._dry = this.ctx.createGain();
      this._wet = this.ctx.createGain();

      var params = this.meta.params;
      cfg = cfg || {};

      this.type = cfg.type || params.type.defaultValue;
      this.frequency  = cfg.frequency || params.frequency.defaultValue;
      this.resonance = cfg.resonance || params.resonance.defaultValue;
      this.gain = cfg.gain || params.gain.defaultValue;
      this.wet = cfg.wet || params.wet.defaultValue;
      this.dry = cfg.dry || params.dry.defaultValue;

      this.input.connect(this._filter);
      this._filter.connect(this._wet);
      this._wet.connect(this.output);

      this.input.connect(this._dry);
      this._dry.connect(this.output);

      this._enabled = true;

      this._envelope = undefined;
    };
    
    Filter.prototype = Object.create(null, {
      connect: {
        value: function(target) {
          this.output.connect(target);
        }
      },
      disconnect: {
        value: function() {
          this.output.disconnect();
        }
      },
      meta: {
        value: {
          params: {
            frequency: {
              min: 30,
              max: 22050,
              defaultValue: 300,
              type: 'float'
            },
            resonance: {
              min:0.0001,
              max: 20,
              defaultValue: 1,
              type: 'float'
            },
            gain: {
              min: -40,
              max: 40,
              defaultValue: 1,
              type: 'float'
            },
            wet: {
              min: 0,
              max: 1,
              defaultValue: 1,
              type: 'float'
            },
            dry: {
              min: 0,
              max: 1,
              defaultValue: 0,
              type: 'float'
            }
          }
        }
      },
      envelope: {
        enumerable: true,
        get: function() {
          return this._envelope;
        },
        set: function(envelope) {
          this._envelope = envelope;
          this._envelope.range = [80, Math.pow(this.frequency/1000, 2.0) * 25000 + 80];
        }
      },
      type: {
        enumerable: true,
        get: function() {
          return this._filter.type;
        },
        set: function(type) {
          this._filter.type = type;
        }
      },
      frequency: {
        enumerable: true,
        get: function() {
          return this._filter.frequency.value;
        },
        set: function(freq) {
          this._filter.frequency.setValueAtTime(freq, 0);
          if (this._envelope && this._envelope.range) {
            this._envelope.range = [80, Math.pow(freq/1000, 2.0) * 25000 + 80];
          }
        }
      },
      resonance: {
        enumerable: true,
        get: function() {
          return this._filter.Q.value;
        },
        set: function(res) {
          this._filter.Q.setValueAtTime(res, 0);
        }
      },
      gain: {
        enumerable: true,
        get: function () { return this._filter.gain.value; },
        set: function (gain) {
          this._filter.gain.setValueAtTime(gain, 0);
        }
      },
      wet: {
        enumerable: true,
        get: function () { return this._wet.gain.value; },
        set: function (wet) {
          this._wet.gain.setValueAtTime(wet, 0);
        }
      },
      dry: {
        enumerable: true,
        get: function () { return this._dry.gain.value; },
        set: function (dry) {
          this._dry.gain.setValueAtTime(dry, 0);
        }
      },
      enabled: {
        enumerable:  true,
        get: function() {
          return this._enabled;
        },
        set: function(enabled) {
          this._enabled = enabled;
          if (this._enabled) {
            this._dry.gain.setValueAtTime(0, 0);
            this._wet.gain.setValueAtTime(1, 0);
          } else {
            this._dry.gain.setValueAtTime(1, 0);
            this._wet.gain.setValueAtTime(0, 0);
          }
        }
      },
      cfg: {
        get: function() {
          return {
            type: this.type,
            frequency: this.frequency,
            resonance: this.resonance,
            gain: this.gain
          };
        },
        set: function(cfg) {
          this.type = cfg.type;
          this.frequency = cfg.frequency;
          this.resonance = cfg.resonance;
          this.gain = cfg.gain;
        }
      }
    });
  
    return Filter;
  });
