/**
* @description 购物车列表
* @author licuiting 250602615@qq.com
* @date 2015-02-10 16:04:30
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var cookie = require('common/kit/io/cookie');
    //
    var com = require('module/cart/common')();
    //数量增减
    var changeNum = require('module/cart/change-num');
    //收藏
    var goodsCol = require('module/cart/goodsCol');
    // 购物车容器
    var eCart = $('#jCart');
    //class
    function List(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    List.prototype = {
        defaultSetting: {
            selector : ''
        },
        // 购物车初始化
        init : function() {
            var self = this;
                //获取复选框的方法
                self.chk = changeNum().chk;
                self.event();
        },
        event : function(){
            var self = this;
            // 单个删除
            eCart.on("click", ".jDel", function() {
                var $this = $(this);
                if ($this.hasClass(com.disClass)) {
                    return;
                }
                com.dialog.confirm({cnt : '确定删除吗？删除后不可恢复哦！',lock:true}, function() {
                    self.del($this);
                }, null);
            });

            // 单个收藏
            eCart.on("click", ".jCol", function() {
                var $this = $(this);

                if ($this.hasClass(com.disClass)) {
                    return;
                }
                self.col($this);
            });
            //优惠方式的显示和隐藏
            eCart.on('click','.jCtit',function(){
                var $parent = $(this).closest('.jPrefer');
                var $ico = $parent.find('.jPreferIcon');//图标
                var $cnt = $parent.find('.jCnt');//内容
                var isVisible = $cnt.is(':visible');
                $cnt[isVisible?'hide':'show']();
                $ico.addClass('display-n').eq(isVisible?'0':'1').removeClass('display-n');
            })
            // 下单结算
            eCart.on("click", "#jSubmit", function() {
                if($(this).hasClass(com.disClass)){
                    return;
                }
                // 未登陆状态
                if (!cookie('_nick')) {
                    location.href = com.loginUrl;
                    return false;
                }
                if (self.checkSubmit()) {
                    com.dialog.tips('请至少选择一个商品!');
                    return false;
                }
                window.location.href = com.bbgUrl.settlement.page;
            });
            //点击当前行跳转页面
            eCart.on('click','.jTableTr',function( e ){
                var $tg = $(e.target); 
                var $a = $(this).find('.pro-img');
                var href = $a.attr('href');
                var isOther = ($tg.closest('.jOther').length!=0);//点击排除元素
                    if(href && $.trim(href).length!=0 && !isOther){
                        location.href = href;
                    }
            });
        },
        /**
         * 判断提交按纽是否可用
         */
        checkSubmit : function() {
            var eSubmit = $('#jSubmit');
            if (!eSubmit) {
                return false;
            }
            var eChkItem = eCart.find('.jChkItem'), count = 0;
            eChkItem.each(function() {
                var $this = $(this);
                if ($this.prop('checked')) {
                    count++;
                }
            });
            if (count > 0) {
                eSubmit.removeClass(com.disClass);
                return false;
            } else {
                eSubmit.addClass(com.disClass);
                return true;
            }
        },
        /**
         * 删除购物车
         */
        del : function(btn) {
            var self = this;
            var info = btn.getProducts({
                isChecked : false
            });
            com.ajax(com.url.del, { productId : info.productId },function( data ){
                com.refreshCartModule( data );
                self.chk.setChk();//重置复选框状态
            });
        },
        /**
         * 收藏商品
         */
        col : function(btn) {
            var $parent = btn.closest('.jTable');
            var eCol = btn.parent('.collection'), info = btn.getProducts({
                isChecked : false
            });
            btn.attr('data-product-id', info.productId);
            btn.attr('data-goods-id',$parent.attr('data-goods-id'));
            btn.goodsCol();
        }
    }
    return function( opt ){
        new List( opt );
    }
});