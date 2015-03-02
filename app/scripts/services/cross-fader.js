'use strict';

angular.module('chunky')
	.factory('CrossFader', function() {
		var CrossFader = function CrossFader(ctx, input1, input2) {
			this.ctx = ctx;
			this.param1 = input1;
			this.param2 = input2;
			this._mix = 0.5;
		};

		CrossFader.prototype = Object.create(null, {
			mix: {
				enumberable: true,
				get: function() {
					return this._mix;
				},
				set: function(mix) {
					this._mix = mix;
					this.param1.value = parseFloat(this._mix);
					this.param2.value = parseFloat(1 - this._mix);
				}
			}
		});
		
		return CrossFader;
	});