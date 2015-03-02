'use strict';

angular.module('chunky')
  .factory('LFO', function() {
    var LFO = function LFO(ctx, cfg) {
      cfg = cfg || {};

      this.ctx = ctx;

      this.output = this.ctx.createScriptProcessor(256, 1, 1);

      this.frequency = cfg.frequency || this.params.frequency.value;
      this.offset = cfg.offset || this.params.offset.value;
      this.oscillation = cfg.offset || this.params.oscillation.value;
      this.phase = cfg.phase || this.params.phase.value;
      this.target = cfg.target || {};
      // This pattern using a callback for process audio has been stolen from TUNA.js thanks guys
      this.output.onaudioprocess = this.callback(cfg.callback || function() {});
    };

    LFO.prototype = Object.create(null, {
      params: {
        writable: true,
        value: {
          frequency: {
            value: 1,
            min: 0,
            max: 20,
            type: 'float'
          },
          offset: {
            value: 0.85,
            min: 0,
            max: 22049,
            type: 'float',
          },
          oscillation: {
            value: 0.3,
            min: -22050,
            max: 22050,
            type: 'float'
          },
          phase: {
            value: 0,
            min: 0,
            max: 2 * Math.PI,
            type: 'float'
          }
        }
      },
      frequency: {
        enumerable: true,
        get: function() {
          return this._frequency;
        },
        set: function(frequency) {
          this._frequency = frequency;
          this._phaseInc = 2 * Math.PI * this._frequency * 256 * 44100;
        }
      },
      offset: {
        enumerable: true,
        get: function() {
          return this._offset;
        },
        set: function(offset) {
          this._offset = offset;
        }
      },
      oscillation: {
        enumerable: true,
        get: function() {
          return this._oscillation;
        },
        set: function(oscillation) {
          this._oscillation = oscillation;
        }
      },
      phase: {
        get: function() {
          return this._phase;
        },
        set: function(phase) {
          this._phase = phase;
        }
      },
      target: {
        get: function() {
          return this._target;
        },
        set: function(target) {
          this._target = target;
        }
      },
      callback: {
        value: function(callback) {
          var self = this;
          return function() {
            self._phase += self._phaseInc;
            if (self.phase > 2 * Math.PI) {
              self.phase = 0;
            }
            callback(self.target, self.offset + self.oscillation * Math.sin(self.phase));
          };
        }
      }
    });

    return LFO;
  });
  // .factory('LFO', function(Oscillator) {
  //   var LFO = function LFO(ctx) {
  //     this.lfo = new Oscillator(ctx, 'sine', 0, 5);
  //     this.output = ctx.createGain();
      
  //     this.lfo.connect(this.output);
      
  //     this.init();
  //   };
    
  //   LFO.prototype = Object.create(null, {
  //     meta: {
  //       value: {
  //         params: {
  //           frequency: {
  //             min: 1,
  //             max: 30,
  //             defaultValue: 5,
  //             type: 'float'
  //           },
  //           gain: {
  //             min: 0,
  //             max: 1,
  //             defaultValue: 0.6,
  //             type: 'float'
  //           }
  //         }
  //       }
  //     },
  //     init: {
  //       value: function() {
  //         this.lfo.init();
  //       }
  //     },
  //     connect: {
  //       value: function(target) {
  //         this.output.connect(target);
  //       }
  //     },
  //     disconnect: {
  //       value: function() {
  //         this.ouput.disconnect();
  //       }
  //     },
  //     frequency: {
  //       enumerable: true,
  //       get: function() {
  //         return this.lfo.frequency;
  //       },
  //       set: function(frequency) {
  //         this.lfo.frequency = frequency;
  //       }
  //     },
  //     gain: {
  //       enumerable: true,
  //       get: function() {
  //         return this.ouput.gain.value;
  //       },
  //       set: function(gain) {
  //         this.output.gain.setValueAtTime(gain, 0);
  //       }
  //     }
  //   });
    
  //   return LFO;
  // });
