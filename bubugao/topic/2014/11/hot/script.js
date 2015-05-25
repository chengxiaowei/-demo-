define(function (require, exports, module){
	'use strict';
	 var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');

	var slotMachine = require('mall/topic/2014/11/hot/slotMachine');

	var eLeftNav = $('#jLeft'); 
	var helpTop = $('.help').offset().top;
	var eBody = $('body'),bodyScrollTop;
	var jHover = $('#jHover');
	var $win = $(window);
	function scrollTop() {
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
			}else if(bodyScrollTop  < parseInt($(window).height())*3/5){
				 eLeftNav && eLeftNav.removeClass('anim-nav-show');
			}else{ 
				eLeftNav && eLeftNav.css({bottom : 100});
				eLeftNav && eLeftNav.addClass('anim-nav-show');
			} 
	}
	scrollTop();
	if(jHover){ 
		jHover.hover(function() { 
			$(this).find('img').attr("src",'//static5.bubugao.com/mall/topic/2014/11/hot/img/img-3.jpg');
		}, function() {  
			$(this).find('img').attr("src",'//static5.bubugao.com/mall/topic/2014/11/hot/img/img-2.jpg');
		});
	}

	$win.bind({
		'resize' : scrollTop
	});
	$win.bind({
		'scroll' : scrollTop
	});

	var light = $('#jLight a');
	 
	light.hover(function() { 
		$(this).removeClass('hover-bg').siblings().addClass('hover-bg');
	},function() {
		light.removeClass('hover-bg');
	});


	var opt = {
        initUrl: "http://10.200.51.193/openapi/zdd.coupon/sendCoupon/init/1?callback=_aftinit",
        url : 'http://10.200.51.193/openapi/zdd.coupon/sendCoupon',
        selector : '#main'
    }
    slotMachine (opt); 
});