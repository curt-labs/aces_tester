'use strict';

/**
*  Part Result
* Part result filters
*/
angular.module('acesTester').filter('filterResults',function(){
	return function(filters, scope){
		var parts = scope.parts;
		var ids = [];
		var hidden = false;
		if($('.result').get().length > 0){
			hidden = true;
		}
		for (var i = filters.length - 1; i >= 0; i--) {
			var p = parts[i];
			if(hidden){
				if($('.result[data-id='+p.PartId+']').is(':visible')){
					ids.push(p.PartId);
				}
			}else{
				ids.push(p.PartId);
			}
		}
		var availFilters = [];
		for (var i = 0; i < filters.length; i++) {
			var f = filters[i];
			var opts = [];
			for (var j = 0; j < f.Options.length; j++) {
				var opt = f.Options[j];
				if(opt === undefined){
					continue;
				}
				var prods = [];
				for (var k = opt.Products.length - 1; k >= 0; k--) {
					var prod = opt.Products[k];
					if(ids.indexOf(prod) !== -1){
						prods.push(prod);
					}
				}
				opt.Products = prods;
				if(opt.Products.length > 0){
					opts.push(opt);
				}
			}
			f.Options = opts;
			if(f.Options.length > 0){
				availFilters.push(f);
			}
		}
		return availFilters;
	};
});