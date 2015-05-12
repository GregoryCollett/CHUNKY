'use strict';
// I stopped here because:
// I need to take a step back and look at how this should work
// This was a blind quick mock of what it should possibly do
// If anyone cares to help and implement, please feel free :)
angular.module('chunky')
	.factory('nodeRouter', function() {
		var Route = function(from, to) {
			this.from = from;
			this.to = to;
		};

		// for now it seems routes will have to be pushed in order of connection.
		var nodeRouter = function(input, output) {
			this.input = input;
			this.routes = [];
			this.output = output;
		};

		nodeRouter.prototype = Object.create(null, {
			register: {
				value: function(route) {
					if (!route && route.from && route.to) {
						console.log('A route must consist of a from and a to');
					}

					this.routes.push(route);

					this.reconnect();
				}
			},
			reconnect: {
				value: function() {
					var i;

					for (i = 0; this.routes.length < i; i++) {

					}
				}
			}
		});

	});