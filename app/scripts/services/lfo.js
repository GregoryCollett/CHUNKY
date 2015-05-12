'use strict';

/*
** Chunky LFO (Low Frequency Oscillator)
** Use: Used to modulate a web audio parameter.
** Thoughts: How can we improve this module>>
** Currently their is some crazy circular reference which I want to get rid of....
*/
angular.module('chunky')
  .factory('LFO', function(Oscillator) {
    var LFO = function LFO(ctx, cfg) {
      cfg = cfg || {};

      this.ctx = ctx;

      this.lfo = this.ctx.createOscillator();
      this.lfo.start(0);
      this.lfo.frequency.value = cfg.frequency || this.params.frequency.defaultValue;
      this.output = ctx.createGain();
      this.output.gain.value = cfg.gain || this.params.gain.defaultValue;
      
      this.lfo.connect(this.output);
    };
    
    LFO.prototype = Object.create(null, {
      rates: {
        value : {
          '1': '',
          '1/2': '',
          '1/2T': '',
          '1/4': '',
          '1/4T': '',
          '1/8': '',
          '1/8T': '',
          '1/16': '',
          '1/16T': '',
        }
      },
      params: {
        value: {
          frequency: {
            name: 'frequency',
            label: 'FREQ',
            min: 1,
            step: 0.01,
            max: 20,
            defaultValue: 5,
            type: 'float'
          },
          gain: {
            name: 'gain',
            label: 'AMT',
            min: 0,
            step: 0.01,
            max: 100,
            defaultValue: 20,
            type: 'float'
          }
        }
      },
      connect: {
        value: function(target) {
          this.output.connect(target);
        }
      },
      disconnect: {
        value: function() {
          this.ouput.disconnect();
        }
      },
      rate: {
        get: function() {
          return this._rate;
        },
        set: function(rate) {
          this._rate = rate;
          this.syncFrequency(this._rate);
        }
      },
      sync: {
        get: function() {
          return this._sync;
        },
        set: function(sync) {
          this._sync = sync;
          if (this._sync) {
            this.frequency = this.syncFrequency(this.rate);
          }
        }
      },
      syncFrequency: {
        value: function(rate) {
          var beatsPerMinute = this.ctx.tempo,
              beatsPerMeasure = 4,
              baseMeasure = 4,
              secondsPerBeat = 60 / beatsPerMinute,
              secondsPerMeasure = secondsPerBeat * beatsPerMeasure,
              secondsPerNote = secondsPerBeat * (baseMeasure / rate),
              frequency = 1 / secondsPerNote;

          return frequency;
        }
      },
      frequency: {
        enumerable: true,
        get: function() {
          return this.lfo.frequency.value;
        },
        set: function(frequency) {
          this.lfo.frequency.setValueAtTime(frequency, 0);
        }
      },
      gain: {
        enumerable: true,
        get: function() {
          return this.output.gain.value;
        },
        set: function(gain) {
          this.output.gain.setValueAtTime(gain, 0);
        }
      },
      cfg: {
        get: function() {
          return {
            frequency: this.frequency,
            amount: this.gain
          };
        },
        set: function(cfg) {
          this.frequency = cfg.frequency || this.params.frequency.defaultValue;
          this.gain = cfg.amount || this.params.gain.defaultValue;
        }
      }
    });
    
    return LFO;
  });
