'use strict';

angular.module('chunky', ['ngRoute','ui.bootstrap', 'indexedDB'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
    })
    .otherwise({
      redirectTo: '/'
    });
  });