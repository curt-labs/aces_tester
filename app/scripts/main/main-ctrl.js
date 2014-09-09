'use strict';

angular.module('acesTester')
	.controller('MainCtrl', ['lookupFactory', '$scope','$http', '$sce', function (lookupFactory, $scope, $http, $sce) {

		Array.prototype.unique = function() {
			var a = this.concat();
			for(var i=0; i<a.length; ++i) {
				for(var j=i+1; j<a.length; ++j) {
					if(a[i] === a[j]){
						a.splice(j--, 1);
					}
				}
			}
			return a;
		};

		$scope.years = [];
		$scope.makes = [];
		$scope.models = [];
		$scope.submodels = [];
		$scope.configurations = [];
		$scope.filters = [];
		$scope.filtered = [];
		$scope.parts = [];

		// Events
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
			localStorage.setItem('vehicle',JSON.stringify($scope.vehicle));
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
			localStorage.setItem('vehicle',JSON.stringify($scope.vehicle));
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
			localStorage.setItem('vehicle',JSON.stringify($scope.vehicle));
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
		$scope.getConfigurations = function(callback){
			$scope.configurations = [];
			$scope.vehicle = {
				base:{
					year: parseInt($('.years').val(),0),
					make: $('.makes').val(),
					model: $('.models').val()
				},
				submodel: $('.submodels').val()
			};
			localStorage.setItem('vehicle',JSON.stringify($scope.vehicle));
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
			if(callback){
				callback();
			}
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
			localStorage.setItem('vehicle',JSON.stringify($scope.vehicle));

			lookupFactory.query($scope.vehicle).then(function(data){
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
		$scope.updateFilter = function(filter, idx, evt){

			var products = [];
			var checkedFilters = 0;
			var filters = $('.filter-segment').get();
			for (var i = 0; i < filters.length; i++) {
				var f = filters[i];
				var items = $(f).find('li').get();
				var filterProducts = [];
				for (var j = 0; j < items.length; j++) {
					var item = items[j];
					if($(item).find('input').is(':checked')){
						checkedFilters++;
						var prods = $scope.filters[i].Options[j].Products;
						console.log(prods);
						if(filterProducts.length === 0){
							filterProducts = prods;
						}else{
							var availProds = [];
							for (var l = 0; l < prods.length; l++) {
								console.log(filterProducts, prods[l]);
								if(filterProducts.indexOf(prods[i]) !== -1){
									availProds.push(prods[l]);
								}
							}
							filterProducts = filterProducts.concat(availProds);
						}
						filterProducts = filterProducts.concat(prods).unique();
					}
				}
				if(filterProducts.length > 0){
					// console.log(filterProducts);
				}

				if(products.length === 0){
					products = filterProducts;
				}else if(filterProducts.length > 0){

					for (var j = products.length - 1; j >= 0; j--) {
						var prod = products[j];
						if(filterProducts.indexOf(prod) === -1){
							products = products.splice(j, 1);
						}
					}
				}
			}

			if(checkedFilters === 0){
				$('.result').show();
				return;
			}

			if(products.length === 0){
				$('.result').hide();
				return;
			}

			var containing = false;
			if($(evt.currentTarget).is(':checked')){
				containing = true;
			}
			angular.forEach($('.result').get(),function(res){
				var id = parseInt($(res).data('id'),0);
				if(products.indexOf(id) !== -1){
					// if(containing){
						// $(res).hide();
					// }else{
						$(res).show();
					// }
				}else{
					$(res).hide();
				}
			});
			$scope.triggerDigest();
		};

		$scope.triggerDigest = function(){

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
		$scope.loadFromStorage = function(){
			$scope.vehicle = JSON.parse(localStorage.getItem('vehicle'));
			lookupFactory.query({}).then(function(data){
				if(data.available_years !== undefined && data.available_years !== null){
					$scope.years = data.available_years;
					setTimeout(function(){
						$('.years').val($scope.vehicle.base.year.toString());
					}, 100);
				}
			});
			lookupFactory.query({
				base:{
					year:$scope.vehicle.base.year
				}
			}).then(function(data){
				if(data.available_makes !== undefined && data.available_makes !== null){
					$scope.makes = data.available_makes;
					setTimeout(function(){
						$('.makes').val($scope.vehicle.base.make);
					}, 100);
				}
			});
			lookupFactory.query({
				base:{
					year:$scope.vehicle.base.year,
					make:$scope.vehicle.base.make
				}
			}).then(function(data){
				if(data.available_models !== undefined && data.available_models !== null){
					$scope.models = data.available_models;
					setTimeout(function(){
						$('.models').val($scope.vehicle.base.model);
					}, 100);
				}
			});
			lookupFactory.query({
				base:{
					year:$scope.vehicle.base.year,
					make:$scope.vehicle.base.make,
					model:$scope.vehicle.base.model
				}
			}).then(function(data){
				if(data.available_submodels !== undefined && data.available_submodels !== null){
					$scope.submodels = data.available_submodels;
					setTimeout(function(){
						$('.submodels').val($scope.vehicle.submodel);
						var configs = $scope.vehicle.configurations;
						$scope.getConfigurations(function(){
							if(configs !== undefined){
								setTimeout(function(){
									for (var i = configs.length - 1; i >= 0; i--) {
										var config = configs[i];
										// $scope.vehicle.configurations.push(config);
										$('select[data-type="'+config.type+'"]').val(config.value);
									}
									localStorage.setItem('vehicle',JSON.stringify($scope.vehicle));
								}, 1000);
							}
						});
					}, 100);
				}
			});
		};

		if(localStorage.getItem('vehicle') === '' || localStorage.getItem('vehicle') === null){
			$scope.vehicle = {
				base:{
					year: '- Select Year -',
					make: '- Select Make -',
					model: '- Select Model -'
				}
			};
			lookupFactory.query($scope.vehicle).then(function(data){
				if(data.available_years !== undefined && data.available_years !== null){
					$scope.years = data.available_years;
				}
			});
		}else{
			$scope.loadFromStorage();
		}

	}]);
