define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');

    //加入购物车
    exports.addcart = function(productId, quantity, obj) {
        var data = {
            'productId': productId,   //商品ID
            'quantity': quantity,      //商品数量
            'source': 'wap'                //来源
        };
        io.jsonp('http://m.yunhou.com/cart/add', data, function(){
            Dialog.tips({
                cnt: '添加成功</br>商品已成功加入购物车！',
                time: 1500
            });
            var data = {
                'source': 'wap'
            };
            io.jsonp('http://m.yunhou.com/cart/getSimple', data, function(data){
                $('.ui-num').text(data.data.totalType);
            },function(e){
                Dialog.tips(e.msg);
            })
        },function(e){
            Dialog.tips(e.msg);
        },obj);
    }
    //更新迷你购物车

    exports.getcart = function() {
        var data = {
                'source': 'wap'
        };
        io.jsonp('http://m.yunhou.com/cart/getSimple', data, function(data){
            $('.ui-num').text(data.data.totalType);
        },function(e){
            Dialog.tips(e.msg);
        })
    }
});
