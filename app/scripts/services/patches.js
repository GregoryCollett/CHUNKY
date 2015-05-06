'use strict';

angular.module('chunky')
	.service('Patches', function($http, localStorageService) {
		var Patches = function Patches() {
			// setup the default collection property
			this.list = [];

			// run syncronise as soon as this object is called.
			this.sync();
		};

		Patches.prototype = Object.create(null, {
			// register a new patch on to the current list.
			register: {
				value: function(patch) {
					this.list.push(patch);
				}
			},
			// Sync patches stored in web storage :)
			sync: {
				value: function() {
					// 1: load the default patches
					this.load('/data/patches.json');

					// 2: load the patches already in local storage.
					var patches = localStorageService.keys();
					var i;

					for (i = 0; i < patches.length; i++) {
						// get the patch object from local storage
						var patch = localStorageService.get(patches[i])
						// register the patch onto the system
						this.register(patch);
					}
				}
			},
			// the lookup processor - Processes the lookup list from a list of patches
			_lookup: {
				value: function() {
					var lookup = [],
						i;

					// for each patch push to the final lookup
					for (i = 0; i < this.list.length; i++) {
						lookup.push({id: i, name: this.list[i].name });
					}

					return lookup;
				}
			},
			// the lookup being bound to the view
			lookup: {
				get: function() {
					return this._lookup();
				}
			},
			// load patches from a given url (could be user created so on so on...)
			load: {
				value: function(url) {
					// the promise returned from the get request
					var p = $http.get(url);
					// we cant use bind so unfortunately we set this to scope var
					var self = this;

					// success patches imported
					function success(r) {
						// ensure that the result is an array
						if (angular.isArray(r)) {
							var i;
							// for each patch in the returned patches list
							for (i = 0; i < r.length; i++) {
								// for each patch loaded from the given url push the patch to local storage.
								localStorageService.set(r[i].name, r[i]);
							}
						}
					}

					// error importing the patches
					function error() {
						console.log('unable to load the requested patches');
					}

					// complete the promise
					p.success(success).error(error);
				}
			}
		});
	
		// initialise the object as a singleton service
		return new Patches();
	});