'use strict';

angular.module('chunky')
	.factory('base', function() {
		var Base = function Base(ctx) {
			this.ctx = ctx;
			this.input = this.ctx.createGain();
			this.output = this.ctx.createGain();
			this.enabled = true;
		};

		Base.prototype = Object.create(null, {
			connect: {
				value: function(target) {
					this._target = target;
					this.output.connect(target.input ? target.input : target);
				}
			},
			disconnect: {
				value: function() {
					this.output.disconnect();
				}
			},
			toggleEnabled: {
				value: function() {
					this.enabled = !this.enabled;
				}
			}
		});

		return Base;
	});