'use strict';

angular.module('acesTester')
	.factory('lookupFactory', function ($resource) {

		return $resource('http://localhost:800/vehicle',
		{'year':'@_year'},
		{ getYears: { method: 'POST'}});
	});
