'use strict';

angular.module('chunky')
  .directive('keyboard', function($window) {
    return {
      restrict: 'EA',
      scope: {
        keyup: '&',
        keydown: '&',
        polyphonic: '=',
        startNote: '='
      },
      link: function(scope, elem) {
        // Setup qwerty hancock with some default values
        var keyboard = new QwertyHancock({
          id: elem.id,
          width: $window.window.innerWidth,
          height: 150,
          octaves: 2,
          startNote: scope.startNote || 'C1'
        });

        // setup
        var depressedKeys = {};

        // On key down
        keyboard.keyDown = function (note, frequency) {
          // on key down apply the following
          scope.$apply(function(){
            // run the keydown callback with the given note and frequency (start note)
            scope.keydown()(note, frequency);
            // add currently pressed keys to object of depressedKeys
            depressedKeys[note] = true;
          });
        };

        // On key up
        keyboard.keyUp = function (note, frequency) {
          // on key up apply the following
          scope.$apply(function(){
            // delete the note from depressedkeys objects
            delete depressedKeys[note];
            // if is polyphonic
            if (scope.polyphonic) {
              // run key up (stop the note)
              scope.keyup()(note, frequency);
            }
          });
        };
      }
    } ;
  });
