define(function(require, exports, module) {
    'use strict';
    var slotMachine = require('app/plug/slotMachine');
    var opt = {
            initUrl: "http://www.yunhou.com/openapi/zdd.coupon/sendCoupon/init/1?callback=_aftinit",
            url : 'http://www.yunhou.com/openapi/zdd.coupon/sendCoupon',
            selector : '#main',
            isTest:true
        }
    slotMachine(opt); 
});