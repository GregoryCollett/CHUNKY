'use strict';

angular.module('chunky')
  .directive('oscilloscope', function() {
    return {
      restrict: 'EA',
      template: '<canvas></canvas>',
      replace: true,
      scope: {
        analyser: '='
      },
      link: function(scope, elem, attr) {
        var parent = elem.parent();
        var cvs = elem[0],
            ctx = cvs.getContext('2d'),
            bufferLength = scope.analyser.fftSize,
            data = new Uint8Array(bufferLength);
        
        cvs.width = parent[0].offsetWidth;
        scope.analyser.getByteTimeDomainData(data);
        
        var draw = function () {
          var drawVisual = requestAnimationFrame(draw);
          
          scope.analyser.getByteTimeDomainData(data);
          
          ctx.fillStyle = 'rgb(200, 200, 200)';
          ctx.fillRect(0, 0, cvs.width, cvs.height);
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgb(0, 0, 0)';

          ctx.beginPath();
          
          var sliceWidth = cvs.width * 10 / bufferLength;
          var x = 0;
          
          for(var i = 0; i < bufferLength; i++) {
            var v = data[i] / 128.0;
            var y = v * cvs.height/2;

            if(i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }
          
          ctx.lineTo(cvs.width, cvs.height/2);
          ctx.stroke();
        };
        
        draw();
      }
    };
  });