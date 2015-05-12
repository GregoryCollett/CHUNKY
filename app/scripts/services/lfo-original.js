'use strict';

/*
* Chunky LFO (Low Frequency Oscillator)
* Use: Used to modulate a web audio parameter.
* Thoughts: How can we improve this module>>
* Currently their is some crazy circular reference which I want to get rid of....
*/
angular.module('chunky').factory('LFO', function() {
    var LFO = function LFO(ctx, cfg) {
      cfg = cfg || {};

      this.ctx = ctx;

      this.output = this.ctx.createScriptProcessor(256, 1, 1);

      this.frequency = cfg.frequency || this.params.frequency.value;
      this.offset = cfg.offset || this.params.offset.value;
      this.oscillation = cfg.offset || this.params.oscillation.value;
      this.phase = cfg.phase || this.params.phase.value;
      this.targets = cfg.targets || {};

      this.output.onaudioprocess = this.callback(cfg.callback || function() {});

      this.output.connect(this.ctx.destination);
    };

    LFO.prototype = Object.create(null, {
      params: {
        writable: true,
        value: {
          frequency: {
            name: 'frequency',
            label: 'FREQ',
            value: 1,
            defaultValue: 1,
            min: 0,
            max: 20,
            step: 0.01,
            type: 'float'
          },
          offset: {
            name: 'offset',
            label: 'OFST',
            value: 0.85,
            defaultValue: 0.85,
            min: 0,
            max: 22049,
            step: 1,
            type: 'float',
          },
          oscillation: {
            name: 'oscillation',
            label: 'OSC',
            value: 0.3,
            defaultValue: 0.3,
            min: -22050,
            max: 22050,
            step: 1,
            type: 'float'
          },
          phase: {
            name: 'phase',
            label: 'PHSE',
            value: 0,
            defaultValue: 0,
            min: 0,
            max: 2 * Math.PI,
            step: 0.01,
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
          this._frequency = parseFloat(frequency);
          this.params.frequency.value = parseFloat(frequency);
          this._phaseInc = 2 * Math.PI * this._frequency * 256 * 44100;
        }
      },
      offset: {
        enumerable: true,
        get: function() {
          return this._offset;
        },
        set: function(offset) {
          this._offset = parseFloat(offset);
          this.params.offset.value = parseFloat(offset);
        }
      },
      oscillation: {
        enumerable: true,
        get: function() {
          return this._oscillation;
        },
        set: function(oscillation) {
          this._oscillation = parseFloat(oscillation);
          this.params.oscillation.value = parseFloat(oscillation);
        }
      },
      phase: {
        get: function() {
          return this._phase;
        },
        set: function(phase) {
          this._phase = parseFloat(phase);
          this.params.phase.value = parseFloat(phase);
        }
      },
      targets: {
        get: function() {
          return this._target;
        },
        set: function(targets) {
          this._targets = targets;
        }
      },
      callback: {
        value: function(callback) {
          var self = this;
          return function() {
            self._phase += self._phaseInc;
            if (self._phase > 2 * Math.PI) {
              self._phase = 0;
            }
            for (var target in self.targets) {
              callback(target, self._offset + self._oscillation * Math.sin(self._phase));
            }
            
          };
        }
      }
    });

    return LFO;
  });