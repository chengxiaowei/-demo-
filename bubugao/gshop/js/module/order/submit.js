/**
* @description 提交订单
* @author licuiting 250602615@qq.com
* @date 2015-02-12 16:51:17
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var com = require('module/order/common')();
    var scroll = require('common/widget/zepto.scroll');
    //class
    function Submit(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    Submit.prototype = {
        defaultSetting: {
            selector : '',
            //三级地址提示
            threeAddrInfo : '由于商城系统地址升级，请重新更新地址，让配送服务更精确！'
        },
        init:function(){
            this.event();
        },
        // 提交订单
        subOrderFun : function() {
            var _self = this;
            $('#jSubBtn').addClass(com.disClass);
            com.ajax(com.url.subOrder, {}, function(data) {
                if(data && data.length!=0){
                    location.href = com.url.payAddr + "?orderid=" + (data.join(','))+'&showwxpaytitle=1';
                }
                $('#jSubBtn').removeClass(com.disClass);
            },function(data){
                $('#jSubBtn').removeClass(com.disClass);
            });
        },
        // 创建表单隐藏域
        createFormHidden : function(data) {
            var str = '';
            var $form = $('#jSubForm');
            $.each(data, function(k, v) {
                str += '<input type="hidden" name="' + v.name + '" value="' + v.value + '"/>';
            });
            $form.prepend(str);
        },
        event : function(){
            var _self = this;
            com.o.on('click', '#jSubBtn', function() {
                var $this = $(this);
                if($(this).hasClass(com.disClass)){
                    return;
                }
                var $sbTag = $(this).attr('data-sbTag');//0:可以正常提交; 非0:弹出submitTips信息
                var $tips = $(this).attr('data-tips');//提示信息
                //
                var $chk = $('#jAddress').find('.jNoData').length;
                var $invoice = $('[name=jInvoiceType]:checked');//发票
                // 判断是否选中了默认地址
                if ($('.jProductlistTable').length == 0) {
                    com.dialog.alert('当前无可结算商品，您可去首页继续逛逛！', function() {
                        //location.href = com.bbgUrl.index.page;
                    });
                } else if($chk && $chk.length!=0) {
                    //
                    com.dialog.alert('请先选择一个收货地址!', function() {
                        // 滚动条定位;
                        $.scrollTo({
                            endY: $("#jAddress").position().top,
                            duration: 400,
                            callback : function(){
                                 
                            }
                        });
                    });
                } else if($('#jAddrDiv') && $('#jAddrDiv').attr('data-is-old')==1){
                    com.dialog.alert(_self.threeAddrInfo, function() {
                        // 滚动条定位;
                        $.scrollTo({
                            endY: $("#jAddress").position().top,
                            duration: 400
                        });
                    });
                }else if($('#jIdInfo').find('.jNoData').length!=0){
                    //是否选择了实名认证
                    com.dialog.alert('请填写身份证信息', function() {
                        // 滚动条定位;
                        $.scrollTo({
                            endY: $('#jIdInfo').position().top,
                            duration: 400
                        });
                    });
                }else if($sbTag && $sbTag!=0){
                    com.dialog.tips($tips);
                }else {
                    _self.subOrderFun();
                }
            })
        }
    }
    return function( opt ){
        new Submit( opt );
    }
});
