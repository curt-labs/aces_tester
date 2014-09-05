/* global:$ */

'use strict';

angular.module('acesTester')
	.controller('MainCtrl', ['lookupFactory', '$scope','$http', '$sce', function (lookupFactory, $scope, $http, $sce) {

		$scope.years = [];
		$scope.makes = [];
		$scope.models = [];
		$scope.submodels = [];
		$scope.configurations = [];
		$scope.filters = [];
		$scope.parts = [];
		$scope.vehicle = {
			base:{
				year: '- Select Year -',
				make: '- Select Make -',
				model: '- Select Model -'
			}
		};

		$scope.getMakes = function(){
			$scope.makes = [];
			$scope.models = [];
			$scope.submodels = [];
			$scope.parts = [];
			$scope.filters = [];
			$scope.configurations = [];
			$scope.vehicle = {
				base:{
					year: parseInt($('.years').val(),0)
				}
			};
			lookupFactory.query($scope.vehicle).then(function(data){
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
			$scope.filters = [];
			$scope.vehicle = {
				base:{
					year: parseInt($('.years').val(),0),
					make: $('.makes').val()
				}
			};
			lookupFactory.query($scope.vehicle).then(function(data){
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
			lookupFactory.query($scope.vehicle).then(function(data){
				$scope.submodels = [];
				if(data.available_submodels !== undefined && data.available_submodels !== null){
					$scope.submodels = data.available_submodels;
				}
				$scope.parts = [];
				if(data.parts !== undefined && data.parts !== null){
					$scope.parts = data.parts;
				}
				$scope.filters = [];
				if(data.filter !== undefined && data.filter !== null){
					$scope.filters = data.filter;
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
				},
				submodel: $('.submodels').val()
			};
			lookupFactory.query($scope.vehicle).then(function(data){
				if(data.available_configurations !== undefined && data.available_configurations !== null){
					$scope.configurations = data.available_configurations;
				}
				$scope.parts = [];
				if(data.parts !== undefined && data.parts !== null){
					$scope.parts = data.parts;
				}
				$scope.filters = [];
				if(data.filter !== undefined && data.filter !== null){
					$scope.filters = data.filter;
				}
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


		// View Functions
		$scope.getPrice = function(part){
			if(part.Pricing === null && part.Customer === null){
				return '';
			}
			if(part.Customer !== undefined && part.Customer.Price !== undefined && part.Customer.Price > 0){
				return '$'+part.Customer.Price;
			}

			angular.forEach(part.Pricing, function(pr){
				if(pr.Type === 'List'){
					return '$' + pr.Price;
				}
			});

			return 'Call for Price';
		};
		$scope.getUPC = function(part){
			if(part.Attributes === null){
				return '';
			}
			for(var i = 0; i < part.Attributes.length; i++){
				if(part.Attributes[i].Key === 'UPC'){
					return part.Attributes[i].Value;
				}
			}
		};
		$scope.getImages = function(part, size){
			var images = [];
			for(var i = 0; i < part.Images.length; i++){
				if(part.Images[i].Size === size){
					var path = part.Images[i].Path;
					images.push(path.Scheme + '://'+ path.Host + path.Path);
				}
			}
			return images;
		};
		$scope.getInstall = function(part){
			if(part.InstallSheet === undefined || part.InstallSheet === null){
				return '#';
			}
			return part.InstallSheet.Scheme + '://' + part.InstallSheet.Host + part.InstallSheet.Path;
		};
		$scope.getVideo = function(part){
			if(part.Videos === undefined || part.Videos === null || part.Videos.length === 0){
				return '';
			}

			var video = null;
			for (var i = part.Videos.length - 1; i >= 0; i--) {
				if(part.Videos[i].IsPrimary){
					video = part.Videos[i];
					break;
				}
			}
			if (video === null){
				var idx = Math.floor((Math.random() * (part.Videos.length -1)));
				video = part.Videos[idx];
			}
			return $sce.trustAsHtml('<iframe width="100%" height="200" src="//www.youtube.com/embed/'+video.YouTubeVideoId+'" frameborder="0" allowfullscreen></iframe>');
		};

		lookupFactory.query($scope.vehicle).then(function(data){
			if(data.available_years !== undefined && data.available_years !== null){
				$scope.years = data.available_years;
			}
		});

	}]);
