'use strict';

angular.module('chunky')
  .factory('Envelope', function() {
    var EnvelopeParam = function EnvelopeParam(cfg) {
      this.parent = cfg.parent || null;
      this.target = cfg.target || null;
      this.meta = cfg.meta || {};
      this.range = cfg.range || this.params.range.defaultValue;
    };
    EnvelopeParam.prototype = Object.create(null, {
      range: {
        get: function() {
          return [this.min, this.max];
        },
        set: function(range) {
          this.min = parseFloat(range[0]);
          this.max = parseFloat(range[1]);
        }
      },
      params: {
        value: {
          range: {
            defaultValue: [0, 1]
          }
        }
      }
    });

    var Envelope = function Envelope(ctx) {
      this.ctx = ctx;
      
      this.attack = 1000;
      this.decay = 50000.0;
      this.sustain = 100;
      this.release = 1000;
      
      this.inverted = false;
      this.reTrigger = false;

      this.targets = [];
    };
    
    Envelope.prototype = Object.create(null, {
      params: {
        value: {
          attack: {
            name: 'attack',
            label: 'ATK',
            min: 0,
            max: 50000,
          },
          decay: {
            name: 'decay',
            label: 'DCY',
            min: 0,
            max: 50000,
          },
          sustain: {
            name: 'sustain',
            label: 'SUS',
            min: 0,
            max: 100,
          },
          release: {
            name: 'release',
            label: 'REL',
            min: 0,
            max: 50000,
          }
        }
      },
      connect: {
        value: function(target, param, meta) {
          var finalTarget;

          if (angular.isArray(param)) {
            finalTarget = target[param[0]][param[1]];
          } else {
            finalTarget = target[param];
          }

          var moddableParam = new EnvelopeParam({parent:target, target:finalTarget, meta: meta});
          
          target.envelope = moddableParam;

          this.targets.push(moddableParam);

          return moddableParam;
        }
      },
      attack: {
        get: function() {
          return this._attack;
        },
        set: function(attack) {
          this._attack = parseFloat(attack / 50000.0);
        }
      },
      decay: {
        get: function() {
          return this._decay;
        },
        set: function(decay) {
          this._decay = parseFloat(decay / 50000.0);
        }
      },
      sustain: {
        get: function() {
          return this._sustain;
        },
        set: function(sustain) {
          this._sustain = parseFloat(sustain / 100.0);
        }
      },
      release: {
        get: function() {
          return this._release;
        },
        set: function(release) {
          this._release = parseFloat(release / 50000.0);
        }
      },
      inverted: {
        enumerable: true,
        get: function() {
          return this._inverted;
        },
        set: function(inverted) {
          this._inverted = inverted;
        }
      },
      reTrigger: {
        enumerable: true,
        get: function() {
          return this._retrig;
        },
        set: function(retrig) {
          this._retrig = retrig;
        }
      },
      triggerOn: {
        value: function() {
          var now = this.ctx.currentTime;

          for (var i = 0; i < this.targets.length; i++) {
            this.processTriggerOn(this.targets[i], now);
          }
        }
      },
      processTriggerOn: {
        value: function(param, now) {
          if (!this.inverted) {
            // Reset schedule and set value to base value
            param.target.cancelScheduledValues(now);
            param.target.setValueAtTime(param.min, now);
            // Attack to max value
            param.target.exponentialRampToValueAtTime(param.max, now + this.attack);
            // Decay and Sustain (for now :D)
            param.target.linearRampToValueAtTime(this.sustain * (param.max - param.min) + param.min, (now + this.attack + this.decay));
          } else {
            // Reset schedule and set value to base value
            param.target.cancelScheduledValues(now);
            param.target.setValueAtTime(param.max, now);
            // Attack to max value
            param.target.linearRampToValueAtTime(param.min, now + this.attack);
            // Decay and Sustain (for now :D)
            param.target.linearRampToValueAtTime(this.sustain * (param.min - param.max) + param.max, (now + this.attack + this.decay));
          }
        }
      },
      triggerOff: {
        value: function() {
          var now = this.ctx.currentTime;
          for (var i = 0; i < this.targets.length; i++) {
            // Release the note or param or whatever the fuck is being played
            // (in theory this should really delay the note stop at current... it doesnt!!)
            this.targets[i].target.linearRampToValueAtTime(0, now + this.release);
            this.targets[i].target.linearRampToValueAtTime(0, now + this.release + 0.01);
            this.targets[i].target.cancelScheduledValues(0, now + this.release + 0.02);
          }
        }
      }
    });
    
    return Envelope;
  });
