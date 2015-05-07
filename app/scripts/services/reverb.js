'use strict';

angular.module('chunky')
  .factory('Reverb', function() {
    var Reverb = function Reverb(ctx) {
      this.ctx = ctx;
        
      this.input = this.ctx.createGain();
      this.node = this.ctx.createConvolver();
      this.output = this.ctx.createGain();
      this._dry = this.ctx.createGain();
      this._wet = this.ctx.createGain();

      this.output.gain.value = 1;
      this._dry.gain.value = 1;
      this._wet.gain.value = 0;

      this._seconds = 2;
      this._decay = 2;
      this._reverse = 0;
      
      this.input.connect(this.node);
      this.node.connect(this._wet);
      this._wet.connect(this.output);

      this.input.connect(this._dry);
      this._dry.connect(this.output);
        
      this.buildImpulse();
        
      this.enabled = false;
    };
  
    Reverb.prototype = Object.create(null, {
      meta: {
        value: {
          params: {

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
          this.output.disconnect();
        }
      },
      buildImpulse: {
        value:function() {
          var rate = this.ctx.sampleRate,
              length = rate * this._seconds,
              decay = this._decay,
              impulse = this.ctx.createBuffer(2, length, rate),
              impulseL = impulse.getChannelData(0),
              impulseR = impulse.getChannelData(1),
              n,
              i;
          
          for (i = 0; i < length; i++) {
            n = this._reverse ? length - 1 : i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
          }
          
          this.node.buffer = impulse;
        }
      },
      toggleEnabled: {
        value: function() {
          this.enabled = !this.enabled;
          if (this.enabled) {
            this._wet.gain.value = 1;
          } else {
            this._wet.gain.value = 0;
          }
        }
      },
      seconds: {
        enumerable: true,
        get: function() {
          return this._seconds;
        },
        set: function(seconds) {
          this._seconds = seconds;
          this.buildImpulse();
        }
      },
      decay: {
        enumerable: true,
        get: function() {
          return this._decay;
        },
        set: function(decay) {
          this._decay = decay;
          this.buildImpulse();
        }
      },
      cfg: {
        get: function() {
          return {
            enabled: this.enabled,
            seconds: this.seconds,
            decay: this.decay
          };
        },
        set: function(cfg) {
          this.decay = cfg.decay;
          this.seconds = cfg.seconds;
          this.decay = cfg.decay;
        }
      }
    });
  
    return Reverb;
  });