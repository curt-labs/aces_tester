'use strict';
/**
* acesTester Module
*
* Cross fade product images
*/
angular.module('acesTester', []).directive('fadeHelper',function(){
	function compile(element){
		element.prepend('<img class="fader">');
		return(link);
	}

	function link($scope, element){
		var fader = element.find('img.fader');
		var primary = element.find('img.partImage');

		$scope.$watch('image',function(newVal, oldVal){
			if(newVal === oldVal || isFading()){ // do nothing
				return;
			}
			initFade(oldVal);
		});

		function initFade(fadeSource){
			fader.prop('src',fadeSource).addClass('show');
			primary.one('load',startFade);
		}

		function isFading(){
			return(
				fader.hasClass('show') || fader.hasClass('fadeOut')
			);
		}

		function startFade(){
			fader.width(); // ensure repaint
			fader.addClass('fadeOut');
			setTimeout(teardownFade, 250);
		}

		function teardownFade(){
			fader.removeClass('show fadeOut');
		}
	}

	return({
		compile:compile,
		restrict: 'A'
	});
});