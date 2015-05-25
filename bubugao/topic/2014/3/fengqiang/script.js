define(function(require, exports, module) {
    'use strict';
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
    $('.jImg-0').imgLoading();
    $('.tab-hd li').click(function(){
    	var index = $(this).index();
    	$(this).addClass('selected').siblings().removeClass('selected');
    	$('.tab-com:eq('+index+')').addClass('selected').siblings().removeClass('selected');
    	$('.jImg-'+index).imgLoading();
    })
});