'use strict';

angular.module('chunky')
	.controller('chunkyController', function($scope, chunkySynth, MidiDevices) {
	    // Set synth to scope so we can bind params and make noises :D
	    $scope.chunky = chunkySynth;

	    // Setup midi support if available in browser
	    // We can move this into th chunky service and make th controller light weight again
	    $scope.midiDevices = MidiDevices;

	    if (MidiDevices.isSupported()) {
	    	MidiDevices.connect()
	    		.then(function(access) {
	    			// To many nested blocks... refactor this.
	    			if (angular.isFunction(access.inputs)) {
	    				$scope.midiDevices.list = access.inputs();
	    			} else {
	    				if (access.inputs && access.inputs.size > 0) {
	    					var inputs = access.inputs.values(),
	    					input = null;

	    					// iterate through the devices
	                        for (input = inputs.next(); input && !input.done; input = inputs.next()) {
	                            $scope.midiDevices.list.push(input.value);
	                        }

	    					console.log('Midi Devices found');
	    				} else {
	    					console.log('No Midi Devices connected');
	    				}
	    			}
	    		});
	    } else {
	    	console.log('MIDI support not available');
	    }

	    $scope.$on('midi::play', function(e, d) {
	    	$scope.chunky.playNote(d.note, d.frequency, d.velocity);
	    });

	    $scope.$on('midi::stop', function(e, d) {
	    	$scope.chunky.stopNote(d.note, d.frequency);
	    });

	    // Setup Keyboard Callbacks
	    $scope.keyboard = {
	    	visible: false,
	    	toggle: function() {
	    		$scope.keyboard.visible = !$scope.keyboard.visible;
	    	},
	      	// On key down play note in chunky
	      	keydown: function(note, frequency) {
	      		$scope.chunky.playNote(note, frequency);
	      	},
	      	// On key up release note in chunky
	      	keyup: function(note, frequency) {
	      		$scope.chunky.stopNote(note, frequency);
	      	}
	  	};

	    // Setup the overlay for info :)
		$scope.overlay = {
			toggled: false,
			toggle: function() {
				$scope.overlay.toggled = !$scope.overlay.toggled;
			}
		};
	});