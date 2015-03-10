'use strict';

angular.module('chunky', ['ngRoute','ui.bootstrap', 'indexedDB'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
    })
    .otherwise({
      redirectTo: '/'
    });
  })
  .controller('chunkyController', function($scope, chunkySynth) {
    // Set synth to scope so we can bind params and make noises :D
    $scope.chunky = chunkySynth;

    // Setup Keyboard Callbacks
    $scope.keyboard = {
      keydown: function(note, frequency) {
        $scope.chunky.playNote(note, frequency);
      },
      keyup: function(note, frequency) {
        $scope.chunky.stop(note, frequency);
      }
    };

    // Setup the overlay for info :)
    $scope.overlay = {
      toggled: false,
      toggle: function() {
        $scope.overlay.toggled = !$scope.overlay.toggled;
      }
    };
  }); 