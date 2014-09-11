'use strict';

angular.module('acesTester')
	.factory('searchFactory', function ($http, $q) {

		var searchFactory = {};

		$http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.headers.post['Content-Type'] = 'application/json';//NOT WORKING

		searchFactory.query = function(term){

			var def = $q.defer();
			$http({
				method: 'get',
				url: 'https://goapi.curtmfg.com/search/'+term+'?key=9300f7bc-2ca6-11e4-8758-42010af0fd79',
				responseType: 'json'
			}).success(def.resolve).error(def.reject);
			return def.promise;
		};

		return searchFactory;
	});
