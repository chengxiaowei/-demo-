/**
 * @description 购物车
 * @author licuiting 250602615@qq.com
 * @date 2015-02-10 14:39:30
 * @version $Id$
 */
define(function(require, exports, module) {
    //
    'use strict';
    //import public lib
    //var goTop = require('common/widget/go-top');
    var com = require('module/cart/common')();
    var _ = require('module/cart/addr')();
    com.showMenu();
    //
    com.getCartData({}, function(){
        //列表
        require('module/cart/list')();
    });
});