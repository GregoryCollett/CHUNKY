'use strict';

angular.module('chunky')
  .service('audioCtx', function($window) {
    var Ctx = window.AudioContext || 
    	window.webkitAudioContext || 
    	window.mozAudioContext || 
    	window.oAudioContext || 
    	window.msAudioContext;
    if (Ctx) {
      return new Ctx();
    }
  });