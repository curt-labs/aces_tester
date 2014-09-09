'use strict';

/**
*  Part Result
* Part result filters
*/
angular.module('acesTester').filter('filterResults',function(){
	return function(filters){
		return filters;
		// var availNumbers = []; // displayable part IDs

		// for (var i = 0; i < scope.parts.length; i++) {
		// 	availNumbers.push(scope.parts[i].PartId);
		// }

		// var filterSegs = $('.filter-segment').get();
		// for (var i = 0; i < filterSegs.length; i++) {
		// 	var seg = filterSegs[i];
		// 	var filterNumbers = [];
		// 	var lis = $(seg).find('li').get();
		// 	var checked = false;
		// 	for (var j = 0; j < lis.length; j++) {
		// 		var li = lis[j];
		// 		if($(li).find('input').is(':checked')){
		// 			decision = true;
		// 			checked = true;
		// 			filterNumbers = filterNumbers.concat(scope.filters[i].Options[j].Products);
		// 		}
		// 	}

		// 	// we got all the numbers that are acceptable by this filter
		// 	// now we need to remove the ones that aren't in this list
		// 	if(checked){
		// 		var nums = [];
		// 		for (var j = 0; j < availNumbers.length; j++) {
		// 			var num = availNumbers[j];
		// 			if(filterNumbers.indexOf(num) !== -1){
		// 				// in the list of acceptable parts
		// 				nums.push(num);
		// 			}
		// 		}
		// 		availNumbers = nums;
		// 	}
		// }
		// var parts = scope.parts;

		// if($('.filter-segment li input:checked').get().length === 0){
		// 	console.log(scope.displayable.length);
		// 	return filters;
		// }

		// var availFilters = [];
		// for (var i = 0; i < filters.length; i++) {
		// 	var f = filters[i];
		// 	var opts = [];
		// 	for (var j = 0; j < f.Options.length; j++) {
		// 		var opt = f.Options[j];
		// 		var avail = false;
		// 		for (var k = 0; k < opt.Products.length; k++) {
		// 			var p = opt.Products[k];
		// 			if($('.result[data-id='+p+']').is(':visible')){
		// 				console.log(p);
		// 				avail = true;
		// 				opts.push(opt);
		// 				break;
		// 			}
		// 		};
		// 	}
		// 	if(opts.length > 0){
		// 		f.Options = opts;
		// 		availFilters.push(f);
		// 	}
		// }


		// return availFilters;
	};
});

angular.module('acesTester').filter('matchedParts', function(){
	return function(parts, scope){
		var decision = false; // track if a decision has been made
		var avail = []; // displayable part objects
		var availNumbers = []; // displayable part IDs

		var i = 0;
		var j = 0;
		for (i = 0; i < parts.length; i++) {
			availNumbers.push(parts[i].PartId);
		}
		var filterSegs = $('.filter-segment').get();
		for (i = 0; i < filterSegs.length; i++) {
			var seg = filterSegs[i];
			var filterNumbers = [];
			var lis = $(seg).find('li').get();
			var checked = false;
			for (j = 0; j < lis.length; j++) {
				var li = lis[j];
				if($(li).find('input').is(':checked')){
					decision = true;
					checked = true;
					filterNumbers = filterNumbers.concat(scope.filters[i].Options[j].Products);
				}
			}

			// we got all the numbers that are acceptable by this filter
			// now we need to remove the ones that aren't in this list
			if(checked){
				var nums = [];
				for (j = 0; j < availNumbers.length; j++) {
					var num = availNumbers[j];
					if(filterNumbers.indexOf(num) !== -1){
						// in the list of acceptable parts
						nums.push(num);
					}
				}
				availNumbers = nums;
			}
		}

		// No decision made -- return all parts
		if(!decision){
			scope.displayable = parts;
			return parts;
		}

		for (i = 0; i < parts.length; i++) {
			var p = parts[i];
			if(availNumbers.indexOf(p.PartId) !== -1){
				avail.push(p);

			}
		}

		scope.displayable = avail;
		return avail;
	};
});