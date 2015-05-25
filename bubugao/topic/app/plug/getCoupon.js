/**
 * 领取优惠券
 *
 * @author jianchaoyi
 */
define(function(require, exports, module) {
    'use strict';
     
    var Dialog = require('pub/plugins/dialog');
    var loadData = require('pub/plugins/jquery.cookie');
    var loginDialog = require('pub/plugins/login-dialog');

    // 登录
    function login() {
        BBG.Login.dialog(function() {
            window.location.reload();
        });
    }


    function GetCoupon(opt) {
        // var apiUrl = 'http://mall.yunhou.com/ajax/get-coupon/100.html';
        // var apiUrl = 'http://mall.yunhou.com/ajax/get-coupon/101.html';
        // var apiUrl = 'http://mall.yunhou.com/ajax/get-coupon/102.html';
        // var apiUrl = 'http://mall.yunhou.com/ajax/get-coupon/106.html';
        // var apiUrl = 'http://mall.yunhou.com/ajax/get-coupon/success.html';
        var apiUrl = 'http://api.mall.yunhou.com/coupon/apply';

        var defaultSetting = {
            selector: null, //jquery对象
            attr: 'data-active-id',
            url: 'data-url',
            callback: function() {}
        };

        opt = $.extend(true, defaultSetting, opt);
        if (!opt.selector) {
            return;
        }
        var eSelector = $(opt.selector);

        eSelector.each(function() {
            var $this = $(this);
            var activeId = $this.attr(opt.attr);
            $this.click(function() {
                var name = $.cookie('_nick'),url = $this.attr(opt.url);
                if (name) {
                    if(url == '' || url == 'undefined') url = apiUrl;
                    BBG.AJAX.jsonp({
                        url: url,
                        data: {
                            activeId: activeId
                        }
                    }, function(data) {
                        if (data.effectStartTime) {
                            BBG.Dialog.ok('恭喜您，领取成功！有效期：' + data.effectStartTime + '至' + data.effectEndTime, $this, 5000);
                        } else {
                            BBG.Dialog.error('貌似领取系统感冒了，再试试看！', $this, 5000);
                        }
                    }, function(data) {
                        var code = null || data._error.code;
                        if (code == -100) {
                            login();
                        } else if (code == 106) {
                            BBG.Dialog.error('当前优惠券仅限手机用户领取，请先进行<a style="color:#c33;" href="http://safe.yunhou.com/safe/mobile">手机绑定</a>', $this, 5000);
                        } else {
                            BBG.Dialog.error(data._error.msg, $this, 5000);
                        }
                    });
                } else {
                    login();
                }
            });
        });
    }
    return GetCoupon;
});