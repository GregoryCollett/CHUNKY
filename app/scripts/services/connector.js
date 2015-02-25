'use strict';

angular.module('chunky')
	.factory('Connector', function() {
		var Connector = function Connector(ctx) {
			this.ctx = ctx;
			this.input = this.ctx.createGain();
			this.output = this.ctx.createGain();
		};

		Connector.prototype = Object.create(null, {
			connect: {
				value: function(target) {
					this.output.connect(target.input || target);
				}
			},
			disconnect: {
				value: function() {
					this.output.disconnect();
				}
			}
		});

		return Connector;
	});