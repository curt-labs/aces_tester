/* global:$ */

'use strict';

angular.module('acesTester')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.years = [];
    $scope.makes = [];
    $scope.models = [];
    $scope.submodels = [];
    $scope.configurations = [];
    $scope.parts = [];
    $scope.vehicle = {
      base:{
        year: '- Select Year -',
        make: '- Select Make -'
      }
    };

    $scope.getMakes = function(){
      $scope.makes = [];
      $scope.models = [];
      $scope.submodels = [];
      $scope.parts = [];
      $scope.configurations = [];
      $scope.vehicle = {
        base:{
          year: parseInt($('.years').val(),0)
        }
      };
      $http({
        url:'http://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79',
        method: 'POST',
        data:$.param({year: $scope.vehicle.base.year}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).success(function(data){
        if(data.available_makes !== undefined && data.available_makes !== null){
          $scope.makes = data.available_makes;
        }
      });
    };
    $scope.getModels = function(){
      $scope.models = [];
      $scope.submodels = [];
      $scope.parts = [];
      $scope.configurations = [];
      $scope.vehicle = {
        base:{
          year: parseInt($('.years').val(),0),
          make: $('.makes').val()
        }
      };
      $http({
        url:'http://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79',
        method: 'POST',
        data:$.param({
          year: $scope.vehicle.base.year,
          make: $('.makes').val()
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).success(function(data){
        if(data.available_models !== undefined && data.available_models !== null){
          $scope.models = data.available_models;
        }
      });
    };
    $scope.getSubmodels = function(){
      $scope.submodels = [];
      $scope.parts = [];
      $scope.configurations = [];
      $scope.vehicle = {
        base:{
          year: parseInt($('.years').val(),0),
          make: $('.makes').val(),
          model: $('.models').val()
        }
      };
      $http({
        url:'http://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79',
        method: 'POST',
        data:$.param({
          year: $scope.vehicle.base.year,
          make: $('.makes').val(),
          model: $('.models').val()
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).success(function(data){
        $scope.submodels = [];
        if(data.available_submodels !== undefined && data.available_submodels !== null){
          $scope.submodels = data.available_submodels;
        }
        $scope.parts = [];
        if(data.parts !== undefined && data.parts !== null){
          $scope.parts = data.parts;
        }
      });
    };
    $scope.getConfigurations = function(){
      $scope.configurations = [];
      $scope.vehicle = {
        base:{
          year: parseInt($('.years').val(),0),
          make: $('.makes').val(),
          model: $('.models').val()
        }
      };
      $http({
        url:'http://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79',
        method: 'POST',
        data:$.param({
          year: $scope.vehicle.base.year,
          make: $('.makes').val(),
          model: $('.models').val(),
          submodel: $('.submodels').val()
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).success(function(data){
        $scope.configurations = data.available_configurations;
      });
    };
    $scope.updateConfiguration = function(){
      $scope.vehicle = {
        base:{
          year: parseInt($('.years').val(),0),
          make: $('.makes').val(),
          model: $('.models').val()
        },
        submodel: $('.submodels').val(),
        configurations: []
      };
      var data = {
        year: $scope.vehicle.base.year,
        make: $scope.vehicle.base.make,
        model: $scope.vehicle.base.model,
        submodel: $scope.vehicle.submodel
      };
      angular.forEach($('.config').get(), function(config){
        data[$(config).data('type')] = $(config).val();
        $scope.vehicle.configurations.push({
          type:$(config).data('type'),
          value: $(config).val()
        });
      });

      $http({
        url:'http://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79',
        method: 'POST',
        data:$.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).success(function(data){
        $scope.parts = data.parts;
      });
    };

    $http({
      url:'http://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).success(function(data){
      if(data.available_years !== undefined && data.available_years !== null){
        $scope.years = data.available_years;
      }
    });
  });
