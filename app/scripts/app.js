'use strict';

angular.module('chunky', ['ngRoute','ui.bootstrap', 'LocalStorageModule'])
  .config(function ($routeProvider, localStorageServiceProvider) {
    $routeProvider
	    .when('/', {
	      templateUrl: 'views/main.html',
	    })
	    .otherwise({
	      redirectTo: '/'
	    });

    localStorageServiceProvider
    	.setPrefix('CHUNKY');
  });