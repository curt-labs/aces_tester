'use strict';

angular.module('acesTester', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngResource', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise("/");
  })
;
