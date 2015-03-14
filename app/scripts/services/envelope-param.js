'use strict';

angular.module('chunky')
  .factory('EnvelopeParam', function() {
    var EnvelopeParam = function EnvelopeParam(cfg) {
      this.parent = cfg.parent || null;
      this.target = cfg.target || null;
      this.meta = cfg.meta || {};
      this.range = this.meta.range || this.params.range.defaultValue;
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
            defaultValue: [0, 100]
          }
        }
      }
    });

    return EnvelopeParam;
  });