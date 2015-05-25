/**
* @description 优惠券
* @author licuiting 250602615@qq.com
* @date 2015-02-11 17:25:44
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var com = require('module/order/common')();
    com.showMenu();
    //class
    function Coupon(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    Coupon.prototype = {
        defaultSetting: {
            selector : ''
        },
        init:function(){
            var self = this;
            self.getCouponsList();
            self.setCouponValue();
            self.event();
        },
        event : function(){
            var self = this;
            // 站外优惠券---确定或取消优惠券
            $('#jUseCoupon').on('click', '#jSubBtn', function() {
                // 优惠券名称;
                var _this = this;
                var $this = $(this);
                var $parent = $('#jUseCoupon');// parent
                var $tips = $('#msg');// 提示信息对象;
                var shopId = com.getUrlParam('shopId');
                var msg = [ '请输入现金券券码', '不能输入~#^$@%&!*\'<>等字符'];// 验证输入信息
                var textArr = [ '使用', '取消' ];
                var isSure = ($this.text() == textArr[0]);// 是否是'确定'文字
                var $coupon = $('#jCouponInput');//优惠券对象
                var $val = $coupon.val();// 站外优惠券内容
                var isEmpty = $.trim($val).length == 0;// 是否为空
                var isHasSpChar = com.isHasSpChar($.trim($val));// 是否包含特殊字符
                // 验证是否为空,是否包含特殊字符;
                if (isEmpty || isHasSpChar) {
                    $tips.show().html(msg[(isEmpty ? 0 : 1)]);
                } else {
                    $tips.hide();
                    // 使用或取消优惠券
                    com.ajax(com.url[(isSure ? 'use' : 'cancel') + 'Offers'], {
                        couponType : 'out',
                        code : $val,
                        shopId : shopId
                    }, function(data) {
                        // 有数据就显示
                        if (data) {
                            com.dialog.tips({cnt:(isSure ? '使用' : '取消') + '优惠券成功', time:1000}, 
                                function(){
                                // 切换文字
                                $this.text(textArr[(isSure ? 1 : 0)]);
                                location.href = com.url.refreshPage;
                            });
                        }
                    }, function(){
                        //清空文本框
                        if(isSure){
                            $coupon.val('').focus();
                        }else{
                            $coupon.focus();
                        } 
                    });
                }
            })
            // 站内优惠券--使用
            .on('change', '#jCouponsList', function() {
                var _this = this;
                var $parent = $('#jUseCoupon');// 父级
                var shopId = com.getUrlParam('shopId'); // shopId
                var _cCode = com.getUrlParam('code');//
                var $couponsBtn = $parent.find('#jSubBtn');// 使用优惠券确定按钮
                var isSelecteOption = $(this).val() == 'null';// 是否是'请选择'选项
                //
                if(_cCode && _cCode.length!=0){
                    $(_this).attr('data-value',_cCode);
                }
                //
                var attrValue = $(this).attr('data-value');// 缓存的优惠券的值
                var flag = (isSelecteOption && attrValue) || !isSelecteOption;
                flag && com.ajax(com.url[isSelecteOption ? 'cancelOffers' : 'useOffers'], {
                    couponType : 'in',
                    shopId : shopId,
                    code : (isSelecteOption ? $(this).attr('data-value') : $(_this).val())
                }, function(data) {
                    if (data) {
                        if (!isSelecteOption) {
                            $(_this).attr('data-value', $(_this).val());
                        } else {
                            $(_this).removeAttr('data-value');
                        }
                        com.dialog.tips({cnt:(isSelecteOption ? '取消' : '使用') + '优惠券成功!', time:1000}, function(){
                            // 切换文字
                            $couponsBtn.text('使用');
                            location.href = com.url.refreshPage;
                        });
                    }
                },function(){
                    //报错要还原下拉框初始状态
                    $(_this).val('null');
                })
            })
        },
        // 获取优惠券列表
        getCouponsList : function() {
            var _self = this;
            var $select = $('#jCouponsList');
            var $parent = $('#jUseCoupon');
            var shopId = com.getUrlParam('shopId');
            var _cType = com.getUrlParam('type');
            var _cCode = com.getUrlParam('code');
            //
            com.ajax(com.url.couponList, {
                shopId : shopId
            }, function(data) {
                $select.html(_self.createCouponsStr(data));
                if(_cType && _cType=='in'){
                    (!_cCode || _cCode.length==0)?_cCode='null':'';
                    $select.val(_cCode).attr('data-value',_cCode);
                }
            })
        },
        //设置优惠券码的值
        setCouponValue : function(){
            var _cType = com.getUrlParam('type');
            var _cCode = com.getUrlParam('code');
            if(_cType=='out' && _cCode && _cCode.length!=0){
                $('#jCouponInput').val(_cCode);
                $('#jSubBtn').text('取消');
            }
        },
        // 生成下拉列表字符串
        createCouponsStr : function(data) {
            var str = '<option value="null">不使用优惠券</option>';
            for ( var i = 0; i < data.length; i++) {
                str += '<option value="' + data[i]['code'] + '">' + data[i]['cpnsName'] + '</option>';
            }
            return str;
        }
    }
    new Coupon( );
});