'use strict';

angular.module('chunky')
  .service('audioCtx', function($window) {
    var Ctx = window.AudioContext || 
    	window.webkitAudioContext || 
    	window.mozAudioContext || 
    	window.oAudioContext || 
    	window.msAudioContext;
    if (Ctx) {
      // Nice and dirty audio workers hehehehehehehehehheheahhahaha amurmuahauhauhauajaudhdgsdks
      Ctx.prototype.createAudioWorker = function(script, input, output) {
        return new AudioWorkerNode(this, script, input, output);
      };
      return new Ctx();
    }
  });