define(function(require, exports, module) {
    'use strict'; 
	var _ = require('pub/plugins/min-bar');
	 	_ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
	var $ = require('jquery');

    var mengTop = $('.shop').scrollTop();
	var eBody = $('body'),bodyScrollTop;
	var eMengNav = $('.shop'); 
	function mengNav(){
		bodyScrollTop =  eBody.scrollTop();
		if(bodyScrollTop > mengTop){
			eMengNav && eMengNav.css({
				position : 'fixed'
			}); 
		}else{
			eMengNav && eMengNav.css({
				position : 'relative'
			});
		}
	}
	mengNav();
	$(window).bind({
		'scroll' : mengNav
	});
})