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
          this.min = range[0];
          this.max = range[1];
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
      
      this._attack = 1000 / 50000.0;
      this._decay = 50000.0 / 50000.0;
      this._sustain = 100 / 100.0;
      this._release = 1000 / 50000.0;
      
      this.params = [];
    };
    
    Envelope.prototype = Object.create(null, {
      connect: {
        value: function(target, param, meta) {
          var finalTarget;

          if (angular.isArray(param)) {
            finalTarget = target[param[0]][param[1]];
          } else {
            finalTarget = target[param];
          }

          var param = new EnvelopeParam({parent:target, target:finalTarget, meta: meta});
          
          target.envelope = param;

          this.params.push(param);

          return param;
        }
      },
      attack: {
        get: function() {
          return this._attack;
        },
        set: function(attack) {
          this._attack = attack / 50000.0;
        }
      },
      decay: {
        get: function() {
          return this._decay;
        },
        set: function(decay) {
          this._decay = decay / 50000.0;
        }
      },
      sustain: {
        get: function() {
          return this._sustain;
        },
        set: function(sustain) {
          this._sustain = sustain / 100.0;
        }
      },
      release: {
        get: function() {
          return this._release;
        },
        set: function(release) {
          this._release = release / 50000.0;
        }
      },
      triggerOn: {
        value: function() {
          var now = this.ctx.currentTime,
              self = this;

          angular.forEach(this.params, function (param) {
            var attack = parseFloat(now + self.attack),
              min = parseFloat(param.min),
              max = parseFloat(param.max);

            param.target.cancelScheduledValues(now);

            param.target.setValueAtTime(0, now);

            param.target.linearRampToValueAtTime(max, attack);

            param.target.linearRampToValueAtTime(self.sustain * (max - min) + min, (attack + self.decay));
          });
        }
      },
      triggerOff: {
        value: function() {
          var now = this.ctx.currentTime,
              self = this;

          angular.forEach(this.params, function(param) {
            param.target.linearRampToValueAtTime(0, now + parseFloat(self.release));
            param.target.linearRampToValueAtTime(0, now + parseFloat(self.release) + 0.01);
            param.target.cancelScheduledValues(0, now + parseFloat(self.release) + 0.02);
          });
        }
      }
    });
    
    return Envelope;
  });
