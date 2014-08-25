'use strict';

angular.module('acesTester', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngResource', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $urlRouterProvider.otherwise("/");
  })
;
