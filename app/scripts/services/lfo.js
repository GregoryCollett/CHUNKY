'use strict';

angular.module('chunky')
  .factory('LFO', function(Oscillator) {
    var LFO = function LFO(ctx) {
      this.lfo = new Oscillator(ctx, 'sine', 0, 5);
      this.output = ctx.createGain();
      
      this.lfo.connect(this.output);
      
      this.init();
    };
    
    LFO.prototype = Object.create(null, {
      meta: {
        value: {
          params: {
            frequency: {
              min: 1,
              max: 30,
              defaultValue: 5,
              type: 'float'
            },
            gain: {
              min: 0,
              max: 1,
              defaultValue: 0.6,
              type: 'float'
            }
          }
        }
      },
      init: {
        value: function() {
          this.lfo.init();
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
      frequency: {
        enumerable: true,
        get: function() {
          return this.lfo.frequency;
        },
        set: function(frequency) {
          this.lfo.frequency = frequency;
        }
      },
      gain: {
        enumerable: true,
        get: function() {
          return this.ouput.gain.value;
        },
        set: function(gain) {
          this.output.gain.setValueAtTime(gain, 0);
        }
      }
    });
    
    return LFO;
  });
