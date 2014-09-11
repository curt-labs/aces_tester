"use strict";angular.module("acesTester",["ngAnimate","ngCookies","ngTouch","ngResource","ui.router"]).config(["$stateProvider","$urlRouterProvider","$sceDelegateProvider",function(e,a,t){e.state("home",{url:"/",templateUrl:"partials/main.html",controller:"MainCtrl"}).state("search",{url:"/search",templateUrl:"partials/search.html",controller:"SearchCtrl"}),t.resourceUrlWhitelist(["self",/^https?:\/\/(goapi\.)?curtmfg.com/]),a.otherwise("/")}]),angular.module("acesTester").filter("filterResults",function(){return function(e){return e}}),angular.module("acesTester").filter("matchedParts",function(){return function(e,a){var t=!1,l=[],s=[],i=0,r=0;for(i=0;i<e.length;i++)s.push(e[i].PartId);var n=$(".filter-segment").get();for(i=0;i<n.length;i++){var o=n[i],c=[],d=$(o).find("li").get(),u=!1;for(r=0;r<d.length;r++){var g=d[r];$(g).find("input").is(":checked")&&(t=!0,u=!0,c=c.concat(a.filters[i].Options[r].Products))}if(u){var v=[];for(r=0;r<s.length;r++){var p=s[r];-1!==c.indexOf(p)&&v.push(p)}s=v}}if(!t)return a.displayable=e,e;for(i=0;i<e.length;i++){var m=e[i];-1!==s.indexOf(m.PartId)&&l.push(m)}return a.displayable=l,l}}),angular.module("acesTester").factory("lookupFactory",["$http","$q",function(e,a){var t={},l="https://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79";return e.defaults.useXDomain=!0,delete e.defaults.headers.common["X-Requested-With"],e.defaults.headers.post["Content-Type"]="application/json",t.query=function(t){var s=a.defer(),i=t;return e({method:"post",url:l,data:i,headers:{"Content-Type":"application/json; charset=UTF-8"},responseType:"json"}).success(s.resolve).error(s.reject),s.promise},t}]),angular.module("acesTester").factory("searchFactory",["$http","$q",function(e,a){var t={};return e.defaults.useXDomain=!0,delete e.defaults.headers.common["X-Requested-With"],e.defaults.headers.post["Content-Type"]="application/json",t.query=function(t){var l=a.defer();return e({method:"get",url:"https://goapi.curtmfg.com/search/"+t+"?key=9300f7bc-2ca6-11e4-8758-42010af0fd79",responseType:"json"}).success(l.resolve).error(l.reject),l.promise},t}]),angular.module("acesTester").controller("MainCtrl",["lookupFactory","searchFactory","$scope","$http","$sce",function(e,a,t,l,s){Array.prototype.unique=function(){for(var e=this.concat(),a=0;a<e.length;++a)for(var t=a+1;t<e.length;++t)e[a]===e[t]&&e.splice(t--,1);return e},t.search_results=[],t.years=[],t.makes=[],t.models=[],t.submodels=[],t.configurations=[],t.filters=[],t.filtered=[],t.parts=[],t.displayable=[],t.getMakes=function(){t.makes=[],t.models=[],t.submodels=[],t.parts=[],t.filters=[],t.configurations=[],t.vehicle={base:{year:parseInt($(".years").val(),0)}},localStorage.setItem("vehicle",JSON.stringify(t.vehicle)),e.query(t.vehicle).then(function(e){void 0!==e.available_makes&&null!==e.available_makes&&(t.makes=e.available_makes)})},t.getModels=function(){t.models=[],t.submodels=[],t.parts=[],t.configurations=[],t.filters=[],t.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val()}},localStorage.setItem("vehicle",JSON.stringify(t.vehicle)),e.query(t.vehicle).then(function(e){void 0!==e.available_models&&null!==e.available_models&&(t.models=e.available_models)})},t.getSubmodels=function(){t.submodels=[],t.parts=[],t.configurations=[],t.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()}},localStorage.setItem("vehicle",JSON.stringify(t.vehicle)),e.query(t.vehicle).then(function(e){t.submodels=[],void 0!==e.available_submodels&&null!==e.available_submodels&&(t.submodels=e.available_submodels),t.parts=[],void 0!==e.parts&&null!==e.parts&&(t.parts=e.parts),t.filters=[],void 0!==e.filter&&null!==e.filter&&(t.filters=e.filter)})},t.getConfigurations=function(a){t.configurations=[],t.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()},submodel:$(".submodels").val()},localStorage.setItem("vehicle",JSON.stringify(t.vehicle)),e.query(t.vehicle).then(function(e){void 0!==e.available_configurations&&null!==e.available_configurations&&(t.configurations=e.available_configurations),t.parts=[],void 0!==e.parts&&null!==e.parts&&(t.parts=e.parts),t.filters=[],void 0!==e.filter&&null!==e.filter&&(t.filters=e.filter)}),a&&a()},t.updateConfiguration=function(){t.vehicle={base:{year:parseInt($(".years").val(),0),make:$(".makes").val(),model:$(".models").val()},submodel:$(".submodels").val(),configurations:[]};var a={year:t.vehicle.base.year,make:t.vehicle.base.make,model:t.vehicle.base.model,submodel:t.vehicle.submodel};angular.forEach($(".config").get(),function(e){a[$(e).data("type")]=$(e).val(),t.vehicle.configurations.push({type:$(e).data("type"),value:$(e).val()})}),localStorage.setItem("vehicle",JSON.stringify(t.vehicle)),e.query(t.vehicle).then(function(e){t.parts=[],void 0!==e.parts&&null!==e.parts&&(t.parts=e.parts),t.filters=[],void 0!==e.filter&&null!==e.filter&&(t.filters=e.filter)})},t.updateFilter=function(){t.triggerDigest()},t.triggerDigest=function(){},t.search=function(e){var l=$(e.currentTarget).find("input").val();a.query(l).then(function(e){t.search_results=e.hits.hits})},t.getPrice=function(e){return null===e.Pricing&&null===e.Customer?"":void 0!==e.Customer&&void 0!==e.Customer.Price&&e.Customer.Price>0?"$"+e.Customer.Price:(angular.forEach(e.Pricing,function(e){return"List"===e.Type?"$"+e.Price:void 0}),"Call for Price")},t.getUPC=function(e){if(void 0===e.Attributes||null===e.Attributes)return"";for(var a=0;a<e.Attributes.length;a++)if("UPC"===e.Attributes[a].Key)return e.Attributes[a].Value},t.getImages=function(e,a){var t=[];if(void 0===e.Images||null===e.Images)return t;for(var l=0;l<e.Images.length;l++)if(e.Images[l].Size===a){var s=e.Images[l].Path;t.push(s.Scheme+"://"+s.Host+s.Path)}return t},t.getInstall=function(e){return void 0===e.InstallSheet||null===e.InstallSheet?"#":e.InstallSheet.Scheme+"://"+e.InstallSheet.Host+e.InstallSheet.Path},t.getVideo=function(e){if(void 0===e.Videos||null===e.Videos||0===e.Videos.length)return"";for(var a=null,t=e.Videos.length-1;t>=0;t--)if(e.Videos[t].IsPrimary){a=e.Videos[t];break}if(null===a){var l=Math.floor(Math.random()*(e.Videos.length-1));a=e.Videos[l]}return s.trustAsHtml('<iframe width="100%" height="200" src="//www.youtube.com/embed/'+a.YouTubeVideoId+'" frameborder="0" allowfullscreen></iframe>')},t.loadFromStorage=function(){t.vehicle=JSON.parse(localStorage.getItem("vehicle")),e.query({}).then(function(a){void 0!==a.available_years&&null!==a.available_years&&(t.years=a.available_years,setTimeout(function(){$(".years").val(t.vehicle.base.year.toString()),e.query({base:{year:t.vehicle.base.year}}).then(function(a){void 0!==a.available_makes&&null!==a.available_makes&&(t.makes=a.available_makes,setTimeout(function(){$(".makes").val(t.vehicle.base.make),e.query({base:{year:t.vehicle.base.year,make:t.vehicle.base.make}}).then(function(a){void 0!==a.available_models&&null!==a.available_models&&(t.models=a.available_models,setTimeout(function(){$(".models").val(t.vehicle.base.model),e.query({base:{year:t.vehicle.base.year,make:t.vehicle.base.make,model:t.vehicle.base.model}}).then(function(e){void 0!==e.available_submodels&&null!==e.available_submodels&&(t.submodels=e.available_submodels,setTimeout(function(){$(".submodels").val(t.vehicle.submodel);var e=t.vehicle.configurations;t.getConfigurations(function(){void 0!==e&&setTimeout(function(){for(var a=e.length-1;a>=0;a--){var l=e[a];$('select[data-type="'+l.type+'"]').val(l.value)}localStorage.setItem("vehicle",JSON.stringify(t.vehicle))},1e3)})},100))})},100))})},100))})},100))})},t.showImage=function(e,a,t){var l=$(t.currentTarget).closest(".images").find("img"),s=$(l[0]).attr("src");$(l[0]).attr("src",$(t.currentTarget).attr("src")),$(t.currentTarget).attr("src",s)},""===localStorage.getItem("vehicle")||null===localStorage.getItem("vehicle")?(t.vehicle={base:{year:"- Select Year -",make:"- Select Make -",model:"- Select Model -"}},e.query(t.vehicle).then(function(e){void 0!==e.available_years&&null!==e.available_years&&(t.years=e.available_years)})):t.loadFromStorage(),$(document).on("touch click",".main-nav .menu-item",function(){$(this).find(".dropdown").slideToggle()})}]),angular.module("acesTester").controller("SearchCtrl",[function(){}]),function(e){try{e=angular.module("acesTester")}catch(a){e=angular.module("acesTester",[])}e.run(["$templateCache",function(e){e.put("partials/main.html",'<div class="container-fluid main-menu"><ul class="main-nav col-lg-5 col-md-5"><li class="menu-item">Products<div class="triangle-down"></div><ul class="dropdown"><li>Specialty Towing &amp; Cargo Management</li><li>Cat 2</li><li>Cat 3</li><li>Cat 4</li><li>Cat 5</li><li>Cat 6</li></ul></li><li class="menu-item">About</li><li class="menu-item">Find a Dealer</li></ul><div class="main-search col-lg-7 col-md-7"><form role="form" ng-submit="search($event)"><div class="input-group"><input type="search" class="form-control" placeholder="Search"><div class="input-group-btn"><button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search"></span></button></div></div></form></div></div><div class="row"><div class="col-lg-6 lookup"><h3>Select Vehicle</h3><div class="row"><select class="form-control years" ng-model="vehicle.base.year" ng-change="getMakes()"><option value="0">- Select Year -</option><option value="{{year}}" ng-repeat="year in years">{{year}}</option></select></div><div class="row"><select class="form-control makes" ng-model="vehicle.base.make" ng-change="getModels()"><option value="0">- Select Make -</option><option value="{{make}}" ng-repeat="make in makes">{{make}}</option></select></div><div class="row"><select class="form-control models" ng-model="vehicle.base.model" ng-change="getSubmodels()"><option value="0">- Select Model -</option><option value="{{model}}" ng-repeat="model in models">{{model}}</option></select></div><div class="row" ng-if="submodels.length > 0"><select class="form-control submodels" ng-model="submodel" ng-change="getConfigurations()"><option value="0">- Select Submodel -</option><option value="{{sub}}" ng-repeat="sub in submodels">{{sub}}</option></select></div><div class="configurations"><div class="row" ng-repeat="config in configurations"><select class="form-control config" data-type="{{config.type}}" ng-if="config.options.length > 0" ng-model="configuration" ng-change="updateConfiguration()"><option value="">- Select {{config.type}} -</option><option value="{{opt}}" ng-repeat="opt in config.options">{{opt}}</option></select></div></div></div></div><div class="row" ng-if="parts.length > 0"><div class="accordion-heading hidden-md hidden-lg"><a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Filter Options</a></div><div class="col-lg-3 col-md-3 well filters" ng-if="filters.length > 0"><div class="filter-segment" ng-repeat="filter in filters | filterResults:this"><span class="title">{{filter.Key}}</span><ul><li ng-repeat="(i, opt) in filter.Options" data-id="{{i}}"><input type="checkbox" ng-checked="opt.Selected" ng-click="updateFilter(filter, i, $event)">{{opt.Value}} ( {{opt.Products.length}} )</li></ul></div></div><div class="col-lg-8 col-md-8 col-offset-lg-1"><h3 ng-if="parts.length > 0">Matched Parts</h3><div class="results" ng-if="parts.length > 0"><div class="result" ng-repeat="part in parts | matchedParts:this" ng-model="part" data-id="{{part.PartId}}"><div class="heading"><p class="title pull-left hidden-xs hidden-sm">{{part.ShortDesc}}</p><p class="title hidden-md hidden-lg">{{part.ShortDesc}}</p><div class="hidden-xs hidden-sm pull-right values"><span class="class"><strong>Class</strong>: {{part.PartClass}}</span> <span class="upc"><strong>UPC</strong>: {{getUPC(part)}}</span></div></div><div class="row"><div class="col-lg-5 col-md-5 images hidden-sm hidden-xs"><img class="partImage" ng-src="{{img}}" ng-click="showImage(i, part, $event)" alt="{{part.ShortDesc}} Image {{i}}" ng-repeat="(i, img) in getImages(part, \'Grande\')"></div><div class="col-lg-6 col-md-6 col-offset-lg-1 body hidden-sm hidden-xs"><div class="actions well"><span class="price">{{getPrice(part)}}</span> <a href="#/part/{{part.PartId}}" class="btn btn-default">Add to Cart</a> <a href="getInstall(part)" class="install"><span class="glyphicon glyphicon-wrench"></span> Install Sheet</a><div class="video" ng-bind-html="getVideo(part)"></div></div><div class="content"><p ng-repeat="con in part.Content">{{con.Value}}</p></div><table class="attr-table"><tbody><tr ng-repeat="attr in part.Attributes"><td>{{attr.Key}}</td><td>{{attr.Value}}</td></tr></tbody></table></div><div class="mb-images images hidden-md hidden-lg"><img class="partImage" ng-src="{{img}}" ng-click="showImage(i, part, $event)" alt="{{part.ShortDesc}} Image {{i}}" ng-repeat="(i, img) in getImages(part, \'Medio\')"><div class="clearfix"></div></div><div class="mb-actions hidden-md hidden-lg well row"><div class="col-sm-5 col-xs-5"><span class="price">{{getPrice(part)}}</span></div><div class="col-sm-7 col-xs-7"><div class="btn-group"><a href="#/part/{{part.PartId}}" class="btn btn-default"><span class="glyphicon glyphicon-info-sign"></span></a> <a href="getInstall(part)" class="btn btn-default"><span class="glyphicon glyphicon-wrench"></span></a> <a href="getVideoLink(part)" class="btn btn-default"><span class="glyphicon glyphicon-play-circle"></span></a></div></div><div class="clearfix"></div></div></div></div></div></div></div><div class="row" ng-if="search_results.length > 0"><div class="col-lg-12 col-md-12"><h3>Search Results</h3><div class="results"><div class="result" ng-repeat="result in search_results"><div ng-switch="result._type"><div ng-switch-when="part"><div class="heading"><p class="title pull-left hidden-xs hidden-sm">{{result._source.ShortDesc}}</p><p class="title hidden-md hidden-lg">{{result._source.ShortDesc}}</p><div class="hidden-xs hidden-sm pull-right values"><span class="class"><strong>Class</strong>: {{result._source.PartClass}}</span> <span class="upc"><strong>UPC</strong>: {{getUPC(result._source)}}</span></div></div><div class="row"><div class="col-lg-5 col-md-5 images hidden-sm hidden-xs"><img class="partImage" ng-src="{{img}}" ng-click="showImage(i, result._source, $event)" alt="{{result._source.ShortDesc}} Image {{i}}" ng-repeat="(i, img) in getImages(result._source, \'Grande\')"></div><div class="col-lg-6 col-md-6 col-offset-lg-1 body hidden-sm hidden-xs"><div class="actions well"><span class="price">{{getPrice(result._source)}}</span> <a href="#/part/{{result._source.PartId}}" class="btn btn-default">Add to Cart</a> <a href="getInstall(result._source)" class="install"><span class="glyphicon glyphicon-wrench"></span> Install Sheet</a><div class="video" ng-bind-html="getVideo(result._source)"></div></div><div class="content"><p ng-repeat="con in result._source.Content">{{con.Value}}</p></div><table class="attr-table"><tbody><tr ng-repeat="attr in result._source.Attributes"><td>{{attr.Key}}</td><td>{{attr.Value}}</td></tr></tbody></table></div><div class="mb-images images hidden-md hidden-lg"><img class="partImage" ng-src="{{img}}" ng-click="showImage(i, part, $event)" alt="{{part.ShortDesc}} Image {{i}}" ng-repeat="(i, img) in getImages(part, \'Medio\')"><div class="clearfix"></div></div><div class="mb-actions hidden-md hidden-lg well row"><div class="col-sm-5 col-xs-5"><span class="price">{{getPrice(part)}}</span></div><div class="col-sm-7 col-xs-7"><div class="btn-group"><a href="#/part/{{part.PartId}}" class="btn btn-default"><span class="glyphicon glyphicon-info-sign"></span></a> <a href="getInstall(part)" class="btn btn-default"><span class="glyphicon glyphicon-wrench"></span></a> <a href="getVideoLink(part)" class="btn btn-default"><span class="glyphicon glyphicon-play-circle"></span></a></div></div><div class="clearfix"></div></div></div></div></div></div></div></div></div>')}])}(),function(e){try{e=angular.module("acesTester")}catch(a){e=angular.module("acesTester",[])}e.run(["$templateCache",function(e){e.put("partials/search.html","<p>Search Results go here</p>")}])}();