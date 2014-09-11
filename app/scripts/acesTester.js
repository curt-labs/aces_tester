'use strict';

angular.module('acesTester', [
'ngAnimate',
'ngCookies',
'ngTouch',
'ngResource',
'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      }).state('search',{
      	url: '/search',
      	templateUrl: 'partials/search.html',
      	controller: 'SearchCtrl'
      });

    $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(goapi\.)?curtmfg.com/]);

    $urlRouterProvider.otherwise('/');
  })
;
