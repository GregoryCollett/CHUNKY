'use strict';

/*
** Chunky LFO (Low Frequency Oscillator)
** Use: Used to modulate a web audio parameter.
** Thoughts: How can we improve this module>>
** Currently their is some crazy circular reference which I want to get rid of....
*/
angular.module('chunky')
  // .factory('LFO', function() {
  //   var LFO = function LFO(ctx, cfg) {
  //     cfg = cfg || {};

  //     this.ctx = ctx;

  //     this.output = this.ctx.createScriptProcessor(256, 1, 1);

  //     this.frequency = cfg.frequency || this.params.frequency.value;
  //     this.offset = cfg.offset || this.params.offset.value;
  //     this.oscillation = cfg.offset || this.params.oscillation.value;
  //     this.phase = cfg.phase || this.params.phase.value;
  //     this.targets = cfg.targets || {};

  //     this.output.onaudioprocess = this.callback(cfg.callback || function() {});

  //     this.output.connect(this.ctx.destination);
  //   };

  //   LFO.prototype = Object.create(null, {
  //     params: {
  //       writable: true,
  //       value: {
  //         frequency: {
  //           name: 'frequency',
  //           label: 'FREQ',
  //           value: 1,
  //           defaultValue: 1,
  //           min: 0,
  //           max: 20,
  //           step: 0.01,
  //           type: 'float'
  //         },
  //         offset: {
  //           name: 'offset',
  //           label: 'OFST',
  //           value: 0.85,
  //           defaultValue: 0.85,
  //           min: 0,
  //           max: 22049,
  //           step: 1,
  //           type: 'float',
  //         },
  //         oscillation: {
  //           name: 'oscillation',
  //           label: 'OSC',
  //           value: 0.3,
  //           defaultValue: 0.3,
  //           min: -22050,
  //           max: 22050,
  //           step: 1,
  //           type: 'float'
  //         },
  //         phase: {
  //           name: 'phase',
  //           label: 'PHSE',
  //           value: 0,
  //           defaultValue: 0,
  //           min: 0,
  //           max: 2 * Math.PI,
  //           step: 0.01,
  //           type: 'float'
  //         }
  //       }
  //     },
  //     frequency: {
  //       enumerable: true,
  //       get: function() {
  //         return this._frequency;
  //       },
  //       set: function(frequency) {
  //         this._frequency = parseFloat(frequency);
  //         this.params.frequency.value = parseFloat(frequency);
  //         this._phaseInc = 2 * Math.PI * this._frequency * 256 * 44100;
  //       }
  //     },
  //     offset: {
  //       enumerable: true,
  //       get: function() {
  //         return this._offset;
  //       },
  //       set: function(offset) {
  //         this._offset = parseFloat(offset);
  //         this.params.offset.value = parseFloat(offset);
  //       }
  //     },
  //     oscillation: {
  //       enumerable: true,
  //       get: function() {
  //         return this._oscillation;
  //       },
  //       set: function(oscillation) {
  //         this._oscillation = parseFloat(oscillation);
  //         this.params.oscillation.value = parseFloat(oscillation);
  //       }
  //     },
  //     phase: {
  //       get: function() {
  //         return this._phase;
  //       },
  //       set: function(phase) {
  //         this._phase = parseFloat(phase);
  //         this.params.phase.value = parseFloat(phase);
  //       }
  //     },
  //     targets: {
  //       get: function() {
  //         return this._target;
  //       },
  //       set: function(targets) {
  //         this._targets = targets;
  //       }
  //     },
  //     callback: {
  //       value: function(callback) {
  //         var self = this;
  //         return function() {
  //           self._phase += self._phaseInc;
  //           if (self._phase > 2 * Math.PI) {
  //             self._phase = 0;
  //           }
  //           for (var target in self.targets) {
  //             callback(target, self._offset + self._oscillation * Math.sin(self._phase));
  //           }
            
  //         };
  //       }
  //     }
  //   });

  //   return LFO;
  // });
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
            //this.frequency = this.syncFrequency(this.rate);
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
              frequency = 1 / secondsPerNote;;

          console.log(frequency);
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
      }
    });
    
    return LFO;
  });
