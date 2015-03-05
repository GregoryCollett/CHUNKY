'use strict';


/*
** TODO:
** Aim to create a generic base class for modules that have an input and an output
** In the case that the module does not require an input/output what should I do??? How can I handle this case????
** Thoughts...
** This class would be used in the majority of CHUNKYS modules BUT review question above on how to handle more use cases.
*/
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
					this.output.connect(target.input ? target.input : target);
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