'use strict';

angular.module('acesTester')
	.factory('categoryFactory', function ($http, $q) {

		var categoryFactory = {};
		var domain = 'https://goapi.curtmfg.com/';
		var key = '9300f7bc-2ca6-11e4-8758-42010af0fd79';

		$http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.headers.post['Content-Type'] = 'application/json';//NOT WORKING

		categoryFactory.parents = function(){
			var def = $q.defer();
			$http({
				method: 'get',
				url: domain+'category?key='+key,
				responseType: 'json'
			}).success(def.resolve).error(def.reject);
			return def.promise;
		};

		return categoryFactory;
	});
