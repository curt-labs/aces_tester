"use strict";angular.module("acesTester",["ngAnimate","ngCookies","ngTouch","ngResource","ui.router"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(e,a,l){e.state("home",{url:"/",templateUrl:"partials/main.html",controller:"MainCtrl"}),l.defaults.useXDomain=!0,delete l.defaults.headers.common["X-Requested-With"],a.otherwise("/")}]),angular.module("acesTester").controller("MainCtrl",["$scope","$http",function(e,a){e.years=[],e.makes=[],e.models=[],e.submodels=[],e.configurations=[],e.parts=[],e.vehicle={base:{year:"- Select Year -",make:"- Select Make -"}},e.getMakes=function(){e.makes=[],e.models=[],e.submodels=[],e.parts=[],e.configurations=[],e.vehicle={base:{year:parseInt($(".years").val(),0)}},a({url:"http://goapi.curtmfg.com/vehicle?key=8aee0620-412e-47fc-900a-947820ea1c1d",method:"POST",data:$.param({year:e.vehicle.base.year}),headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).success(function(a){void 0!==a.available_makes&&null!==a.available_makes&&(e.makes=a.available_makes)})},e.getModels=function(){e.models=[],e.submodels=[],e.parts=[],e.configurations=[],e.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val()}},a({url:"http://goapi.curtmfg.com/vehicle?key=8aee0620-412e-47fc-900a-947820ea1c1d",method:"POST",data:$.param({year:e.vehicle.base.year,make:$(".makes").val()}),headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).success(function(a){void 0!==a.available_models&&null!==a.available_models&&(e.models=a.available_models)})},e.getSubmodels=function(){e.submodels=[],e.parts=[],e.configurations=[],e.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()}},a({url:"http://goapi.curtmfg.com/vehicle?key=8aee0620-412e-47fc-900a-947820ea1c1d",method:"POST",data:$.param({year:e.vehicle.base.year,make:$(".makes").val(),model:$(".models").val()}),headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).success(function(a){e.submodels=[],void 0!==a.available_submodels&&null!==a.available_submodels&&(e.submodels=a.available_submodels),e.parts=[],void 0!==a.parts&&null!==a.parts&&(e.parts=a.parts)})},e.getConfigurations=function(){e.configurations=[],e.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()}},a({url:"http://goapi.curtmfg.com/vehicle?key=8aee0620-412e-47fc-900a-947820ea1c1d",method:"POST",data:$.param({year:e.vehicle.base.year,make:$(".makes").val(),model:$(".models").val(),submodel:$(".submodels").val()}),headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).success(function(a){e.configurations=a.available_configurations})},e.updateConfiguration=function(){e.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()},submodel:$(".submodels").val(),configurations:[]};var l={year:e.vehicle.base.year,make:e.vehicle.base.make,model:e.vehicle.base.model,submodel:e.vehicle.submodel};angular.forEach($(".config").get(),function(a){l[$(a).data("type")]=$(a).val(),e.vehicle.configurations.push({type:$(a).data("type"),value:$(a).val()})}),a({url:"http://goapi.curtmfg.com/vehicle?key=8aee0620-412e-47fc-900a-947820ea1c1d",method:"POST",data:$.param(l),headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).success(function(a){e.parts=a.parts})},a({url:"http://goapi.curtmfg.com/vehicle?key=8aee0620-412e-47fc-900a-947820ea1c1d",method:"POST",headers:{"Content-Type":"application/json; charset=utf-8"}}).success(function(a){void 0!==a.available_years&&null!==a.available_years&&(e.years=a.available_years)})}]),function(e){try{e=angular.module("acesTester")}catch(a){e=angular.module("acesTester",[])}e.run(["$templateCache",function(e){e.put("partials/main.html",'<div class="container"><nav class="navbar navbar-static-top navbar-inverse"><div class="navbar-header"><a class="navbar-brand" href="#">ACES Testing</a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-6"><ul class="nav navbar-nav"><li class="active"><a ng-href="#">Home</a></li></ul></div></nav><div class="row"><div class="col-lg-6 lookup"><h3>Select Vehicle</h3><div class="row"><select class="form-control years" ng-model="vehicle.base.year" ng-change="getMakes()"><option value="0">- Select Year -</option><option value="{{year}}" ng-repeat="year in years">{{year}}</option></select></div><div class="row"><select class="form-control makes" ng-model="vehicle.base.make" ng-change="getModels()"><option value="0">- Select Make -</option><option value="{{make}}" ng-repeat="make in makes">{{make}}</option></select></div><div class="row"><select class="form-control models" ng-model="vehicle.base.model" ng-change="getSubmodels()"><option value="0">- Select Model -</option><option value="{{model}}" ng-repeat="model in models">{{model}}</option></select></div><div class="row" ng-if="submodels.length > 0"><select class="form-control submodels" ng-model="submodel" ng-change="getConfigurations()"><option value="0">- Select Submodel -</option><option value="{{sub}}" ng-repeat="sub in submodels">{{sub}}</option></select></div><div class="configurations"><div class="row" ng-repeat="config in configurations"><select class="form-control config" data-type="{{config.type}}" ng-if="config.options.length > 0" ng-model="configuration" ng-change="updateConfiguration()"><option value="">- Select {{config.type}} -</option><option value="{{opt}}" ng-repeat="opt in config.options">{{opt}}</option></select></div></div></div><div class="col-lg-6"><h3 ng-if="parts.length > 0">Matched Parts</h3><ul class="list-group" ng-if="parts.length > 0"><li class="list-group-item" ng-repeat="part in parts">{{part}}</li></ul></div></div><hr><div class="footer"><p>With ♥ from <a href="https://twitter.com/ninnemana">@ninnemana</a></p></div></div>')}])}();