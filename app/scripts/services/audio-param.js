'use strict';

angular.module('chunky')
	.factory('CAParam', function() {
		var CAParam = function(cfg) {
			// Allow params access to the audio context
			this.ctx = cfg.ctx;

			// Audio Parameter Name (how we identify the parameter)
			this.name = cfg.name || '';

			// the web audio param to be manipulated
			this.waParam = cfg.param;

			// Setup the default range object to be used by this.min and this.max
			this.range = {};

			// Minimum value this audio parameter can have
			this.min = cfg.min || this.meta.range.min.defaultValue;

			// Maximum value this audio parameter can have
			this.max = cfg.max || this.meta.range.max.defaultValue;

			// The current value of the audio param
			this.value = cfg.value || this.meta.value.defaultValue;

			// Value mapping function
			this.mappingFunction = cfg.mappingFn || function(v) { return v; };

			// Is the parameter moddable using automation?
			this.isAutomationEnabled = false;

			// Is the parameter modification called from some sort of automation???
			this.isAutomation = false;
		};

		AudioParam.prototype = Object.create(null, {
			// Default meta for AudoParam object
			meta: {
				value: {
					value: {
						defaultValue: 1
					},
					range: {
						min: {
							defaultValue: 0
						},
						max: {
							defaultValue: 1
						}
					}
				}
			},
			// Get and Set current value
			value: {
				enumerable: true,
				get: function() {
					return this.value;
				},
				set: function(value) {
					if (typeof value === 'number') {
						if (value > this.max) {
							value = this.max;
						} else if (value < this.min) {
							value = this.min;
						}
					}

					// if there is a mapping function (thats actually a function)
					if (typeof this.mappingFunction === 'function') {
						// run the mapping function to assign the correct value
						// (should this be done before min and max?)
						value = this.mappingFunction(value);
					}
				}
			},
			// Get and Set min range
			min: {
				enumerable: true,
				get: function() {
					return this.range.min;
				},
				set: function(min) {
					this.range.min = min;
				}
			},
			// Get and Set max range
			max: {
				enumerable: true,
				get: function() {
					return this.range.max;
				},
				set: function(max) {
					this.range.max = max;
				}
			},
			// Cancel any scheduled changes in queue to run against this param
			cancelScheduledValues: {
				value: function(time) {
					if (this.waParam) {
						if (this.waParam instanceof AudioParam) {
							this.waParam.cancelScheduledValues(time);
						} else if (this.waParam instanceof Array) {
							this.waParam.forEach(function(param) {
								param.cancelScheduledValues(time);
							});
						}
					}
				}
			},
			setValueAtTime: {
				value: function(value, time) {
					if (this.waParam) {
						value = this.mappingFunction(value);
						if (this.waParam instanceof AudioParam) {
							this.waParam.setValueAtTime(value, time);
						} else if (this.waParam instanceof Array) {
							this.waPram.foreach(function(param) {
								param.setValueAtTime(value, time);
							});
						}
					}
				}
			},
			setValueCurveAtTime: {
				// @param value: value to ramp to
				// @param time: time to start ramp to value
				// @param duration: time taken to ramp to value
				value: function(value, time, duration) {
					if (this.waParam) {
						value = this.mappingFunction(value);
						if(this.waParam instanceof AudioParam) {
							this.waParam.setValueCurveAtTime(value, time, duration);
						} else if (this.waParam instanceof Array) {
							this.waParam.forEach(function(param) {
								param.setValueCurveAtTime(value, time, duration);
							});
						}
					}
				}
			},
			exponentialRampToValueAtTime: {
				value: function(value, time) {
					if (this.waParam) {
						value = this.mappingFunction(value);
						if (this.waParam instanceof AudioParam) {
							this.waParam.exponentialRampToValueAtTime(value, time);
						} else if (this.waParam instanceof Array) {
							this.waParam.forEach(function(param) {
								param.exponentialRampToValueAtTime(value, time);
							});
						}
					}
				}
			},
			// linear Ramp to Value at the given time (add item to schedule)
			linearRampToValueAtTime: {
				value: function(value, time) {
					if (this.waParam) {
						value = this.mappingFunction(value);
						if (this.waParam instanceof AudioParam) {
							this.waParam.linearRampToValueAtTime(value, time);
						} else if (this.waParam instanceof Array) {
							this.waParam.forEach(function(param) {
								param.linearRampToValueAtTime(value, time);
							});
						}
					}
				}
			}
		});

		return CAParam;
	});