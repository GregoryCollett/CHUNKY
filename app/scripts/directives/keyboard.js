'use strict';

angular.module('chunky')
  .directive('keyboard', function($window) {
        return {
        restrict: 'EA',
      scope: {
        keyup: '&',
        keydown: '&',
        polyphonic: '='
      },
      link: function(scope, elem, attr) {
        var keyboard = new QwertyHancock({
          id: elem.id,
          width: $window.window.innerWidth,
          height: 150,
          octaves: 2,
          startNote: 'C0'
        });
        
        var isEmpty = function(obj) {
          return Object.keys(obj).length === 0;
        };

        var depressedKeys = {};

        keyboard.keyDown = function (note, frequency) {
            scope.$apply(function(){
              scope.keydown()(note, frequency);
              depressedKeys[note] = true;
            });
        };

        keyboard.keyUp = function (note, frequency) {
          scope.$apply(function(){
            delete depressedKeys[note];
            if (scope.polyphonic) {
              scope.keyup()(note, frequency);
            }
          });
        };
      }
    } ;
  });