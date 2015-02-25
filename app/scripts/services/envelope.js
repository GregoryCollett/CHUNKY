'use strict';

angular.module('chunky')
  .factory('Envelope', function() {
    var Envelope = function Envelope(ctx) {
      this.ctx = ctx;
      
      this.min = 0;
      this.max = 1;
      
      this._attack = 1000 / 50000.0;
      this._decay = 50000.0 / 50000.0;
      this._sustain = 100 / 100.0;
      this._release = 1000 / 50000.0;
      
      this.params = [];
    };
    
    Envelope.prototype = Object.create(null, {
      connect: {
        value: function(target, param, meta) {
          var env = this,
          finalTarget;

          target.envelope = env;

          if (angular.isArray(param)) {
            finalTarget = target[param[0]][param[1]]
          } else {
            finalTarget = target[param]
          }

          this.params.push({
            parent: target, 
            target:finalTarget, 
            meta: meta
          });
        }
      },
      disconnect: {
        value: function() {

        }
      },
      adsr: {
        get: function() {
          return [this._attack, this._decay, this._sustain, this._release];
        },
        set: function(adsr) {
          this._attack = adsr[0] / 50000.0;
          this._decay = adsr[0] / 50000.0;
          this._sustain = adsr[0] / 100.0;
          this._release = adsr[0] / 50000.0;
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
          return this._decay
        },
        set: function(decay) {
          this._decay = decay / 50000.0;;
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
          this._release = release / 50000.0;;
        }
      },
      range: {
        get: function() {
          return [this.min, this.max];
        },
        set: function(range) {
          this.min = range[0];
          this.max = range[1];
        }
      },
      triggerOn: {
        value: function() {
          var now = this.ctx.currentTime,
              self = this;

          angular.forEach(this.params, function (param) {
            var attack = parseFloat(now + self.attack),
              min = parseFloat(self.min),
              max = parseFloat(self.max);

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
