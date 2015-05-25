define(function (require, exports, module){
	'use strict';
	 var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');

	var smashingEggs = require('mall/topic/2014/10/eggs/smashingEggs');
	 var opt = {
        url : 'http://www.yunhou.com/openapi/zdd.coupon/sendCoupon',
        setChanceUrl : 'http://www.yunhou.com/openapi/zdd.coupon/sendCoupon/init/1',
        selector : '#jEggs',
        chanceSelector : '#jNum'
    }
    smashingEggs(opt);
});