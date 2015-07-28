'use strict';

angular.module('chunky')
  .factory('vocoder', [function() {

    var Vocoder = function(cfg) {

    }

    Vocoder.prototype = Object.create(null, {

      generateBands: {
        value: function() {
          
        }
      },

      loadNoiseBuffer: {
        value: function() {

        }
      },

      initBandFilters: {
        value: function() {

        }
      },



    });

    return Vocoder;
  }]);
