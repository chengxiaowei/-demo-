define(function(require, exports, module) {
    'use strict';
    
    var _ = require('app/plug/jquery.lightbox');
        _ = require('pub/plugins/jquery.imgLoading');
    var $ = require('jquery');
    var $frame = $('.frame-con');
    if(window.frameElement)
		$frame.height(window.frameElement.parentElement.clientHeight);
	$(".jPic").lightbox({overlayOpacity:0.2});
	$(window).bind('scroll.lazyload resize.lazyload',function(){
		$frame.height($(document).height());
	})
});