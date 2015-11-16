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

		NodeRouter.prototype = Object.create(Object, {
			register: {
				value: function(routables) {
					if (routables instanceof Array) {
						for (var routable in routables) {
							if (!this.isRoutable(routable)) {
								throw new Error('A routable must consist of a name and a node');
							}
							this.routables[routable.name] = routable.node;
						}
					} else {
						if (!this.isRoutable(routables)) {
							throw new Error('A routable must consist of a name and a node');
						}
						this.routables[routables.name] = routables.node;
					}
					return this;
				}
			},
			isRoutable: {
				value: function(routable) {
					if (!routable.name || !routable.node) {
						return false;
					}

					return true;
				}
			},
			route: {
				value: function(route) {
					if (route instanceof Array) {

					}

					if (!route && route.from && route.to) {
						throw new Error('A route must consist of a from and a to');
					}

					this.routes.push(new Route(route.from, route.to));

					this.reconnect();

					return this;
				}
			},
			reconnect: {
				value: function() {
					var route, destination, i;
					// loop through all possible routable items
					for (i = 0; i < this.routes.length; i++) {
					//for (route in this.routeables) {
						route = this.routes[i];
						// if route to has more than one TO
						if (route.to instanceof Array) {
							// loop through the TO's
							for (destination in route.to) {
								// connect the to
								this.routables[route.from].connect(route.to[destination].input ? route.to[destination].input : route.to[destination]);
							}
						// else we assume this is a standard audio Node
						// We should probably add some validation of that...
						} else {
							//console.log(this.routables[route.from]);
							this.routables[route.from].connect(route.to.input ? route.to.input : route.to);
						}
					}
				}
			}
		});

		// should consist of a from (aka the input that gets connected up) and an output
		return new NodeRouter();
	});
