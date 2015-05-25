define(function(require, exports, module) {
    'use strict';
     
    var _ = require('app/plug/tlist');

    var smashingEggs = require('app/plug/smashingEggs');
	 var opt = {
        url : 'http://www.yunhou.com/openapi/zdd.coupon/sendCoupon',
        setChanceUrl : 'http://www.yunhou.com/openapi/zdd.coupon/sendCoupon/init/1',
        selector : '#jEggs',
        chanceSelector : '#jNum',
        isTest:true
    }
    smashingEggs(opt);
});