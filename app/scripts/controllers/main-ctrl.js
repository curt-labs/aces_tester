'use strict';

angular.module('acesTester')
	.controller('MainCtrl', ['lookupFactory', 'searchFactory', 'categoryFactory', '$scope','$http', '$sce', function (lookupFactory, searchFactory, categoryFactory, $scope, $http, $sce) {

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

		$scope.search_results = [];
		$scope.parent_categories = [];
		$scope.years = [];
		$scope.makes = [];
		$scope.models = [];
		$scope.submodels = [];
		$scope.configurations = [];
		$scope.filters = [];
		$scope.filtered = [];
		$scope.parts = [];
		$scope.displayable = [];

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
				$scope.search_results = [];
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
				$scope.search_results = [];
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
				$scope.search_results = [];
				if(data.parts !== undefined && data.parts !== null){
					$scope.parts = data.parts;
				}
				$scope.filters = [];
				if(data.filter !== undefined && data.filter !== null){
					$scope.filters = data.filter;
				}
			});
		};
		$scope.updateFilter = function(){
			$scope.triggerDigest();
		};
		$scope.triggerDigest = function(){};

		// Search Events
		$scope.search = function(evt){
			var term = $(evt.currentTarget).find('input').val();
			searchFactory.query(term).then(function(data){
				$scope.search_results = data.hits.hits;
				$scope.filters = [];
				$scope.filtered = [];
				$scope.parts = [];
				$scope.displayable = [];
			});
		};

		// View Functions
		$scope.getPrice = function(part){
			if(part === undefined || part.Pricing === null && part.Customer === null){
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
			if(part === undefined || part.Attributes === undefined || part.Attributes === null){
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
			if(part === undefined || part.Images === undefined || part.Images === null){
				return images;
			}
			for(var i = 0; i < part.Images.length; i++){
				if(part.Images[i].Size === size){
					var path = part.Images[i].Path;
					images.push(path.Scheme + '://'+ path.Host + path.Path);
				}
			}
			return images;
		};
		$scope.getInstall = function(part){
			if(part === undefined || part.InstallSheet === undefined || part.InstallSheet === null){
				return '#';
			}
			return part.InstallSheet.Scheme + '://' + part.InstallSheet.Host + part.InstallSheet.Path;
		};
		$scope.getVideo = function(part){
			if(part === undefined || part.Videos === undefined || part.Videos === null || part.Videos.length === 0){
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
						lookupFactory.query({
							base:{
								year:$scope.vehicle.base.year
							}
						}).then(function(data){
							if(data.available_makes !== undefined && data.available_makes !== null){
								$scope.makes = data.available_makes;
								setTimeout(function(){
									$('.makes').val($scope.vehicle.base.make);
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
											}, 100);
										}
									});
								}, 100);
							}
						});
					}, 100);
				}
			});
		};
		$scope.showImage = function(index, part, evt){
			var els = $(evt.currentTarget).closest('.images').find('img');
			var old = $(els[0]).attr('src');
			$(els[0]).attr('src', $(evt.currentTarget).attr('src'));
			$(evt.currentTarget).attr('src',old);
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

		categoryFactory.parents().then(function(data){
			$scope.parent_categories = data;
		});

		$(document).on('touch click', '.main-nav .menu-item',function(){
			$(this).find('.dropdown').slideToggle();
		});

	}]);
