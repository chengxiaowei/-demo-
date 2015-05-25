define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var cart = require('module/add-to-cart/addcart');
    var io = require('common/kit/io/request');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var Dialog = require('common/ui/dialog/dialog');

    //导航
    var nav = require('common/ui/nav/nav'); 
    new nav({ 
        clickBtn : '#jCategory', 
        isShowCloud : false 
    });
    
    //更新购物车
    cart.getcart();

    //  加入购物车
    $('.pro-box-list').on('click', '.jAdd2Cart', function() {
        var _this = $(this);
        var id = _this.parent().attr('data-productid').split('-')[1];
        cart.addcart(id, '1', _this);
    });


    //  初始化懒加载
    new Lazyload('img.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url'
    });
});

