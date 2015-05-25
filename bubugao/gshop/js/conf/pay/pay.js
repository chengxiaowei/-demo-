define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    //倒计时
    var countDown = require('common/ui/count-down/jquery.countDown');

    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    var pay = {
        init: function () {
            pay.pay_init(); //初始化支付列表
            pay.lihover();  //列表点击效果
            pay.order_pay();
            pay.init_orderId();
        },
        init_orderId: function(){
            $('#jOrderNum').text(pay.getUrlParam('orderid'));
        },
        lihover: function () {
            $('#jPayLi li').click(function () {
                var index = $('#jPayLi li').index(this),
                    img = $('.jcheckImg'),
                    code = $(this).attr('data-code');
                img.attr('src', '//s1.bbgstatic.com/gshop/images/pay/pay-qx.png');
                img.eq(index).attr('src', '//s1.bbgstatic.com/gshop/images/pay/pay-ok.png');
                $('#jPayLi').attr('data-code', code);
            });
        },
        pay_init: function () {
            var self = this;
            var data = {
                'callback': 'callback',
                'orderIds': pay.getUrlParam('orderid')
            }
            io.jsonp('http://m.yunhou.com/pay/payMethods', data, function (data) {
                var pay_time = data.data.pay_timeout;
                $("#jTimePay").attr({'data-starttime': pay_time.startTime, 'data-endTime': pay_time.endTime});
                $('#jTimePay').text(data.data.pay_timeout.notPayCancelOrderTimeout);
                var html = "", isWxFlag = false;
                //判断是否微信浏览器
                if (self.isWeixin()) {
                    isWxFlag = true;
                }
                for (var i = 0; i < data.data.pay_methods.length; i++) {
                    //判断微信浏览器显示微信支付
                    var code = data.data.pay_methods[i].code, flag = true;
                    if(code==6 && !isWxFlag){
                        flag = false;
                    }
                    if (code == 2 && isWxFlag) {
                        flag = false;
                    }
                    if (flag) {
                        html += '<li data-code="' + code + '"><span class="bank-name"><img class="jcheckImg" src="//s1.bbgstatic.com/gshop/images/pay/pay-qx.png"></span><span class="pay-icon"><img src="' + data.data.pay_methods[i].iconUrl + '"></span><span>' + data.data.pay_methods[i].name + '</span>';
                        var discountAd = data.data.pay_methods[i].discountAd;
                        var curDateRemainActNum =data.data.pay_methods[i].curDateRemainActNum;
                        if (discountAd) {
                            //添加打折活动dom结构
                            html += '<div class="favorable"><span class="favorable-val">' + discountAd + '</span></div>';
                            if (curDateRemainActNum && curDateRemainActNum <= 0) {
                                //添加打折图标
                                html += '<div class="favorable-ico"></div>';
                            }
                        }
                        //结尾标签闭合
                        html += '</li>';
                    }
                }
                $('#jPayLi').append(html);
                pay.lihover();  //列表点击效果
                pay.time();
            }, function (e) {
                if (e.error == -100) {
                        Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                        window.location.href="https://ssl.yunhou.com/login/h5/login.html?ref="+encodeURIComponent(window.location.href)+"";
                    })
                }
                else {
                    Dialog.tips(e.msg);
                }
                $('#jPayLi').append('<li>加载失败，请刷新重试！</li>');
            });
        },
        order_pay: function () {
            $('.jPayBtn').click(function () {
                var self = this;
                if($(self).hasClass('ui-button-disabled')) return false;
                var reset = function(){
                    $(self).removeClass('ui-button-disabled').find('a').html('立即付款');
                }
                $('#jForm').html('');
                var code = $('#jPayLi').attr('data-code');
                var data = {
                    'orderIds': pay.getUrlParam('orderid'),
                    'code': code,
                    'callback': 'callback'
                };
                if (code != '') {
                    $(self).addClass('ui-button-disabled').find('a').html('正在提交，请稍后...');
                    io.jsonp('http://m.yunhou.com/pay/pay', data, function (d) {
                        if (code == 6) {
                            data = (d || {}).data;
                            wx.config({
                                debug: false,
                                appId: data.appId,
                                timestamp: data.timestamp,
                                nonceStr: data.noncestr,
                                signature: data.paySign,
                                jsApiList: [
                                    'chooseWXPay'
                                ]
                            });
                            wx.ready(function(){
                                wx.checkJsApi({
                                    jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                                    success: function (res) {
                                        if (res.checkResult.chooseWXPay) {
                                            wx.chooseWXPay({
                                                timestamp: data.timeStamp,
                                                nonceStr: data.nonceStr,
                                                package: data.package,
                                                signType: data.signType, // 注意：新版支付接口使用 MD5 加密
                                                paySign: data.paySign,
                                                success: function (res) {
                                                    window.location.href = data.linkUrl;
                                                    reset();
                                                },
                                                cancel: function (res) {
                                                    reset();
                                                    //取消回调
                                                },
                                                fail: function (res) {
                                                    reset();
                                                    //失败回调
                                                }
                                            });
                                        } else {
                                            Dialog.tips('请将您的微信升级到最新版！');
                                            reset();
                                        }
                                    },
                                    fail: function(){
                                        Dialog.tips('请将您的微信升级到最新版！');
                                        reset();
                                    }
                                });
                            });
                        } else {
                            $('#jForm').attr({'action': d.data.action, 'method': d.data.method});
                            var html = '';
                            for (var i = 0; i < d.data.params.length; i++) {
                                html += '<input type="text" name="' + d.data.params[i].name + '" value="' + d.data.params[i].value + '"/>';
                            }
                            $('#jForm').html(html);
                            $('#jForm').submit();
                            reset();
                        }
                    }, function (e) {
                        Dialog.tips(e.msg);
                        reset();
                    });
                }
                else {
                    Dialog.tips('请选择支付方式');
                }
            })
        },
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); // 匹配目标参数
            if (r != null)
                return unescape(r[2]);
            return null; // 返回参数值
        },
        time: function () {
            var time_pay = $("#jTimePay");
            countDown({
                currentTime: time_pay.attr('data-starttime'),
                targetTime: time_pay.attr('data-endTime'),
                timeText: ['', '小时', '分', '秒', ''],
                container: time_pay,
                isShowTimeText: true,
                isShowArea: true,
                type: {
                    'd': false,
                    'h': true,
                    'm': true,
                    's': true,
                    'ms': false
                },
                callback: function (dom) {
                    //倒计时为0后回调
                    var data = {
                        'orderIds': pay.getUrlParam('orderid')
                    };
                    io.jsonp('http://m.yunhou.com/checkout/cancelTimeoutOrders', data, function () {
                        $('#jPayDom').remove();
                        $('#jPayErrorDom').show();
                    }, function (e) {
                        Dialog.tips(e.msg);
                    })
                }
            });
        },
        //判断微信内置浏览器
        isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        }
    }

    pay.init();
});
