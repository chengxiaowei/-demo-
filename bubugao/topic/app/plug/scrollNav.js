define(function(require, exports, module) {
    'use strict'; 
    var _  = require('pub/core/bbg');
	
	/**
     * 侧导航滚动
     */
	BBG.rightNav = function() {
		var eRightNav = $('#jRightNav');
		var eBottomNav = $('#jBottomNav');
		var eLeftNav = $('#jLeftNav');
		var eBnCnt = $('#jBnCnt');
		var helpTop;
		var bodyScrollTop;
		function winSize() {
			var size = parseInt(window.screenLeft); 
			helpTop = $('.footer')[0].offsetTop;  
			bodyScrollTop =  parseInt($(document).scrollTop()); 
			if(bodyScrollTop + parseInt($(window).height()) > helpTop){
				eBottomNav && eBottomNav.css({
					position : 'static'
				}); 
				eRightNav && eRightNav.css({
					bottom : bodyScrollTop + parseInt($(window).height()) - helpTop
				});
				eLeftNav && eLeftNav.css({
					bottom : bodyScrollTop + parseInt($(window).height()) - helpTop
				});  
			}else if(bodyScrollTop  < parseInt($(window).height())*3/5){
				if(eRightNav && !eRightNav.hasClass('isShow')) 
					eRightNav.removeClass('anim-nav-show');
				if(eLeftNav && !eLeftNav.hasClass('isShow'))  
					eLeftNav.removeClass('anim-nav-show');
			}else{
				eBottomNav && eBottomNav.css({
					position : 'fixed'
				});
				if(!!window.ActiveXObject&&!window.XMLHttpRequest){
					eBottomNav && eBottomNav.css({
						position : 'absolute'
					});
				}

				eRightNav && eRightNav.css({ 
					bottom : 25
				});
				eRightNav && eRightNav.addClass('anim-nav-show');
				eLeftNav && eLeftNav.css({ 
					bottom : 100
				});
				eLeftNav && eLeftNav.addClass('anim-nav-show');
			}
			
			if(bodyScrollTop>148){
				 
				eBnCnt && eBnCnt.css({
					position:'fixed',
					top : '0'
				});
			}else{
				 
				eBnCnt && eBnCnt.css({
					position:'absolute',
					top : '0'
				});
			}
			
			if (size < 1024) {
				eRightNav && eRightNav.addClass('right-nav-block');
			} else {
				eRightNav && eRightNav.removeClass('right-nav-block');
			}
		}
		winSize();

		$(window).bind('scroll.lazyload resize.lazyload',function(){
			winSize();
		}); 

		function goTop() {
			var eGoTop = eRightNav && eRightNav.find('.go-top');
			if (eGoTop) {
				eGoTop.bind('click' , function() {
					window.scrollTo(0, 0);
				});
			}
		}
		goTop();
	}

    //侧导航滚动
    BBG.rightNav(); 

})