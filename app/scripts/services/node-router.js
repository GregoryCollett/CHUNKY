'use strict';
// I stopped here because:
// I need to take a step back and look at how this should work
// This was a blind quick mock of what it should possibly do
// If anyone cares to help and implement, please feel free :)

// The reasons behind having a node router?
// Routing nodes/wiring modules up differently can massively impact the sound
// generated - this is the sole reason for enabling this custom patching model
angular.module('chunky')
	.service('NodeRouter', function() {
		var Route = function(from, to) {
			this.from = from;
			this.to = to;
		};

		// for now it seems routes will have to be pushed in order of connection.
		var NodeRouter = function(input, output) {
			this.routables = {};
			this.input = input;
			this.routes = [];
			this.output = output;
		};

		NodeRouter.prototype = Object.create(null, {
			route: {
				value: function(route) {
					console.log(route);

					if (!route && route.from && route.to) {
						console.log('A route must consist of a from and a to');
					}

					this.routes.push(new Route(route.from, route.to));

					this.reconnect();
				}
			},
			reconnect: {
				value: function() {
					var route, destination, i;
					// loop through all possible routable items
					for (i = 0; i < this.routes.length; i++) {
					//for (route in this.routeables) {
						var route = this.routes[i];
						// if route to has more than one TO
						if (route.to instanceof Array) {
							// loop through the TO's
							for (destination in route.to) {
								// connect the to
								route.from.connect(route.to[destination].input ? route.to[destination].input : route.to[destination]);
							}
						// else we assume this is a standard audio Node
						// We should probably add some validation of that...
						} else {
							route.from.connect(route.to.input ? route.to.input : route.to);
						}
					}
				}
			}
		});

		// should consist of a from (aka the input that gets connected up) and an output
		return new NodeRouter();
	});
