/**
* @description 结算模块
* @author licuiting 250602615@qq.com
* @date 2014-11-05 10:07:37
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    //var goTop = require('common/widget/go-top');
    var com = require('module/order/common')();
    //
    com.showMenu();
    //
    com.getOrderData({}, function(  ){
        //发票信息
        var idInfo = require('module/order/invoice')();
        //列表
        var list = require('module/order/list')();
        //使用优惠券
        var delivery = require('module/order/coupon')();
        //提交订单
        var sub = require('module/order/submit')();
    });
});
