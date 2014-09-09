"use strict";angular.module("acesTester",["ngAnimate","ngCookies","ngTouch","ngResource","ui.router"]).config(["$stateProvider","$urlRouterProvider","$sceDelegateProvider",function(e,a,l){e.state("home",{url:"/",templateUrl:"partials/main.html",controller:"MainCtrl"}),l.resourceUrlWhitelist(["self",/^https?:\/\/(goapi\.)?curtmfg.com/]),a.otherwise("/")}]),angular.module("acesTester").factory("lookupFactory",["$http","$q",function(e,a){var l={},t="https://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79";return e.defaults.useXDomain=!0,delete e.defaults.headers.common["X-Requested-With"],e.defaults.headers.post["Content-Type"]="application/json",l.query=function(l){var s=a.defer(),i=l;return e({method:"post",url:t,data:i,headers:{"Content-Type":"application/json; charset=UTF-8"},responseType:"json"}).success(s.resolve).error(s.reject),s.promise},l}]),angular.module("acesTester").controller("MainCtrl",["lookupFactory","$scope","$http","$sce",function(e,a,l,t){a.years=[],a.makes=[],a.models=[],a.submodels=[],a.configurations=[],a.filters=[],a.parts=[],""===localStorage.getItem("vehicle")?(a.vehicle={base:{year:"- Select Year -",make:"- Select Make -",model:"- Select Model -"}},e.query(a.vehicle).then(function(e){void 0!==e.available_years&&null!==e.available_years&&(a.years=e.available_years)})):(a.vehicle=JSON.parse(localStorage.getItem("vehicle")),e.query({}).then(function(e){void 0!==e.available_years&&null!==e.available_years&&(a.years=e.available_years,setTimeout(function(){$(".years").val(a.vehicle.base.year.toString())},100))}),e.query({base:{year:a.vehicle.base.year}}).then(function(e){void 0!==e.available_makes&&null!==e.available_makes&&(a.makes=e.available_makes,setTimeout(function(){$(".makes").val(a.vehicle.base.make)},100))}),e.query({base:{year:a.vehicle.base.year,make:a.vehicle.base.make}}).then(function(e){void 0!==e.available_models&&null!==e.available_models&&(a.models=e.available_models,setTimeout(function(){$(".models").val(a.vehicle.base.model)},100))}),e.query({base:{year:a.vehicle.base.year,make:a.vehicle.base.make,model:a.vehicle.base.model}}).then(function(e){void 0!==e.available_submodels&&null!==e.available_submodels&&(a.submodels=e.available_submodels,setTimeout(function(){$(".submodels").val(a.vehicle.submodel);var e=a.vehicle.configurations;a.getConfigurations(function(){a.vehicle.configurations=e,void 0!==e&&setTimeout(function(){for(var a=e.length-1;a>=0;a--){var l=e[a];$('select[data-type="'+l.type+'"]').val(l.value)}},1e3)})},100))})),a.getMakes=function(){a.makes=[],a.models=[],a.submodels=[],a.parts=[],a.filters=[],a.configurations=[],a.vehicle={base:{year:parseInt($(".years").val(),0)}},localStorage.setItem("vehicle",JSON.stringify(a.vehicle)),e.query(a.vehicle).then(function(e){void 0!==e.available_makes&&null!==e.available_makes&&(a.makes=e.available_makes)})},a.getModels=function(){a.models=[],a.submodels=[],a.parts=[],a.configurations=[],a.filters=[],a.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val()}},localStorage.setItem("vehicle",JSON.stringify(a.vehicle)),e.query(a.vehicle).then(function(e){void 0!==e.available_models&&null!==e.available_models&&(a.models=e.available_models)})},a.getSubmodels=function(){a.submodels=[],a.parts=[],a.configurations=[],a.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()}},localStorage.setItem("vehicle",JSON.stringify(a.vehicle)),e.query(a.vehicle).then(function(e){a.submodels=[],void 0!==e.available_submodels&&null!==e.available_submodels&&(a.submodels=e.available_submodels),a.parts=[],void 0!==e.parts&&null!==e.parts&&(a.parts=e.parts),a.filters=[],void 0!==e.filter&&null!==e.filter&&(a.filters=e.filter)})},a.getConfigurations=function(l){a.configurations=[],a.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()},submodel:$(".submodels").val()},localStorage.setItem("vehicle",JSON.stringify(a.vehicle)),e.query(a.vehicle).then(function(e){void 0!==e.available_configurations&&null!==e.available_configurations&&(a.configurations=e.available_configurations),a.parts=[],void 0!==e.parts&&null!==e.parts&&(a.parts=e.parts),a.filters=[],void 0!==e.filter&&null!==e.filter&&(a.filters=e.filter)}),l&&l()},a.updateConfiguration=function(){a.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()},submodel:$(".submodels").val(),configurations:[]};var l={year:a.vehicle.base.year,make:a.vehicle.base.make,model:a.vehicle.base.model,submodel:a.vehicle.submodel};angular.forEach($(".config").get(),function(e){l[$(e).data("type")]=$(e).val(),a.vehicle.configurations.push({type:$(e).data("type"),value:$(e).val()})}),localStorage.setItem("vehicle",JSON.stringify(a.vehicle)),e.query(a.vehicle).then(function(e){a.parts=[],void 0!==e.parts&&null!==e.parts&&(a.parts=e.parts),a.filters=[],void 0!==e.filter&&null!==e.filter&&(a.filters=e.filter)})},a.updateFilter=function(){},a.getPrice=function(e){return null===e.Pricing&&null===e.Customer?"":void 0!==e.Customer&&void 0!==e.Customer.Price&&e.Customer.Price>0?"$"+e.Customer.Price:(angular.forEach(e.Pricing,function(e){return"List"===e.Type?"$"+e.Price:void 0}),"Call for Price")},a.getUPC=function(e){if(null===e.Attributes)return"";for(var a=0;a<e.Attributes.length;a++)if("UPC"===e.Attributes[a].Key)return e.Attributes[a].Value},a.getImages=function(e,a){for(var l=[],t=0;t<e.Images.length;t++)if(e.Images[t].Size===a){var s=e.Images[t].Path;l.push(s.Scheme+"://"+s.Host+s.Path)}return l},a.getInstall=function(e){return void 0===e.InstallSheet||null===e.InstallSheet?"#":e.InstallSheet.Scheme+"://"+e.InstallSheet.Host+e.InstallSheet.Path},a.getVideo=function(e){if(void 0===e.Videos||null===e.Videos||0===e.Videos.length)return"";for(var a=null,l=e.Videos.length-1;l>=0;l--)if(e.Videos[l].IsPrimary){a=e.Videos[l];break}if(null===a){var s=Math.floor(Math.random()*(e.Videos.length-1));a=e.Videos[s]}return t.trustAsHtml('<iframe width="100%" height="200" src="//www.youtube.com/embed/'+a.YouTubeVideoId+'" frameborder="0" allowfullscreen></iframe>')}}]),function(e){try{e=angular.module("acesTester")}catch(a){e=angular.module("acesTester",[])}e.run(["$templateCache",function(e){e.put("partials/main.html",'<div class="container"><nav class="navbar navbar-static-top navbar-inverse"><div class="navbar-header"><a class="navbar-brand" href="#">ACES Testing</a></div></nav><div class="row"><div class="col-lg-6 lookup"><h3>Select Vehicle</h3><div class="row"><select class="form-control years" ng-model="vehicle.base.year" ng-change="getMakes()"><option value="0">- Select Year -</option><option value="{{year}}" ng-repeat="year in years">{{year}}</option></select></div><div class="row"><select class="form-control makes" ng-model="vehicle.base.make" ng-change="getModels()"><option value="0">- Select Make -</option><option value="{{make}}" ng-repeat="make in makes">{{make}}</option></select></div><div class="row"><select class="form-control models" ng-model="vehicle.base.model" ng-change="getSubmodels()"><option value="0">- Select Model -</option><option value="{{model}}" ng-repeat="model in models">{{model}}</option></select></div><div class="row" ng-if="submodels.length > 0"><select class="form-control submodels" ng-model="submodel" ng-change="getConfigurations()"><option value="0">- Select Submodel -</option><option value="{{sub}}" ng-repeat="sub in submodels">{{sub}}</option></select></div><div class="configurations"><div class="row" ng-repeat="config in configurations"><select class="form-control config" data-type="{{config.type}}" ng-if="config.options.length > 0" ng-model="configuration" ng-change="updateConfiguration()"><option value="">- Select {{config.type}} -</option><option value="{{opt}}" ng-repeat="opt in config.options">{{opt}}</option></select></div></div></div></div><div class="row"><div class="col-lg-3 col-md-3 well filters" ng-if="filters.length > 0"><div class="filter-segment" ng-repeat="filter in filters"><span class="title">{{filter.Key}}</span><ul><li ng-repeat="opt in filter.Options"><input type="checkbox" ng-checked="opt.Selected" ng-click="updateFilter()">{{opt.Value}} ( {{opt.Products.length}} )</li></ul></div></div><div class="col-lg-8 col-md-8 col-offset-lg-1"><h3 ng-if="parts.length > 0">Matched Parts</h3><div class="results" ng-if="parts.length > 0"><div class="result" ng-repeat="part in parts"><div class="heading"><p class="title pull-left">{{part.ShortDesc}}</p><div class="pull-right"><span class="class"><strong>Class</strong>: {{part.PartClass}}</span> <span class="upc"><strong>UPC</strong>: {{getUPC(part)}}</span></div></div><div class="row"><div class="col-lg-5 col-md-5 images"><img src="{{img}}" alt="{{part.ShortDesc}} Image {{i}}" ng-repeat="(i, img) in getImages(part, \'Grande\')"></div><div class="col-lg-7 col-md-7 col-offset-lg-1 body"><div class="actions well"><span class="price">{{getPrice(part)}}</span> <a href="#/part/{{part.PartId}}" class="btn btn-default">Add to Cart</a> <a href="getInstall(part)" class="install"><span class="glyphicon glyphicon-wrench"></span> Install Sheet</a><div class="video" ng-bind-html="getVideo(part)"></div></div><div class="content"><p ng-repeat="con in part.Content">{{con.Value}}</p></div></div></div></div></div></div></div><hr><div class="footer"><p>With ♥ from <a href="https://twitter.com/ninnemana">@ninnemana</a></p></div></div>')}])}();