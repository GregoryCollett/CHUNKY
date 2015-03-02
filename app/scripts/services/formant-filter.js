'use strict';

angular.module('chunky')
	.factory('FormantFilter', function() {
		var FormantFilter = function FormantFilter(ctx) {
			this.ctx = ctx;

			this.input = this.ctx.createGain();
			this.output = this.ctx.createGain();
			
			this.vowels = {
		      a: [{F:700, BW:130},{F:1220, BW:70 },{F:2500,BW:160}, {F:3300,BW:250},{F:3750,BW:200},{F:4900,BW:1000}],
		      e: [{F:480, BW:70},{F:1720, BW:100 },{F:2520,BW:200}, {F:3300,BW:250},{F:3750,BW:200},{F:4900,BW:1000}],
		      i: [{F:310, BW:45},{F:2020, BW:200},{F:2960, BW:400}, {F:3300,BW:250},{F:3750,BW:200},{F:4900,BW:1000}],
		      o: [{F:550, BW:80},{F:960, BW:50 },{F:2400,BW:130}, {F:3300,BW:250},{F:3750,BW:200},{F:4900,BW:1000}],
		      u: [{F:350, BW:65},{F:1250, BW:110},{F:2200, BW:140}, {F:3300,BW:250},{F:3750,BW:200},{F:4900,BW:1000}]  
		      //w: [{F:290, BW:50},{F:610, BW:80},{F:2150, BW:60}, {F:3300,BW:250},{F:3750,BW:200},{F:4900,BW:1000}]       
		    };
		};

		FormantFilter.prototype = Object.create(null, {
			connect: {
				value: function(target) {
					this.output.connect(target.input ? target.input : target);
				}
			},
			disconnect: {
				value: function() {
					this.output.disconnect();
				}
			}
		});
	});