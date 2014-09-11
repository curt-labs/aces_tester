'use strict';

angular.module('acesTester')
	.factory('lookupFactory', function ($http, $q) {

		var lookupFactory = {};
		var domain = 'https://goapi.curtmfg.com/vehicle?key=9300f7bc-2ca6-11e4-8758-42010af0fd79';

		$http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.headers.post['Content-Type'] = 'application/json';//NOT WORKING

		lookupFactory.query = function(vehicle){

			var def = $q.defer();
			var params = vehicle;
			$http({
				method: 'post',
				url: domain,
				data: params,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				responseType: 'json'
			}).success(def.resolve).error(def.reject);
			return def.promise;
		};

		return lookupFactory;
	});
