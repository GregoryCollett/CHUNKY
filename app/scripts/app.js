'use strict';

angular.module('chunky', ['ngRoute','ui.bootstrap', 'LocalStorageModule'])
	.config(function ($routeProvider, localStorageServiceProvider) {
		// Setup app routing... This is redundant...
		$routeProvider
		    .when('/', {
		      templateUrl: 'views/main.html',
		    })
		    .otherwise({
		      redirectTo: '/'
		    });

		// Setup local storage configuration
		localStorageServiceProvider
			.setPrefix('CHUNKY');
	})
	.constant('WAVE_SHAPES', {
		SINE: 'sine',
		SQR: 'square',
		TRI: 'triangle',
		SAW: 'saw'
	})
	.constant('FILTER_TYPES', {
		LP: 'lowpass',
		BP: 'bandpass',
		HP: 'highpass',
		NT: 'notch'
	});
