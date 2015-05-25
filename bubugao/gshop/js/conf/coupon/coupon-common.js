define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    var $couponAddBtn = $(".jFetch-btn");
    var urlMap = {
        initAPI: "//m.yunhou.com/ump/getJs",
        fetchCard: "//m.yunhou.com/ump/cardList",
        sendCard: "//m.yunhou.com/ump/sendCard"
    };
    var currentUrl = "";




    var coupon = {
        _isWeixin: function () {
            //�ж��Ƿ���΢�������
            var ua = navigator.userAgent.toLowerCase();
            // ua.substring(ua.lastIndexOf("/") + 1)
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //�ж��Ƿ�Ϊ΢����������Ұ汾6.0������
                return true;
            } else {
                return false;
            }
        },
        _bindEvents: function () {
            wx.ready(function () {
                coupon.readyFunc();
                wx.checkJsApi({
                    jsApiList: ['hideOptionMenu'],  // ��Ҫ����JS�ӿ��б�����JS�ӿ��б����¼2,
                    success: function (res) {
                        if (res.checkResult.hideOptionMenu) {
                            wx.hideOptionMenu();
                        }
                    }
                });
            });
        },
        _initWXInterface: function () {
            //��ʼ��΢��JS API
            currentUrl = window.location.href;
            io.jsonp(urlMap.initAPI, {
                url: currentUrl
            }, function (result) {
                //��ȡ�ӿڳ�ʼ�������ɹ����߼�
                //��ʼ��΢�Žӿ�����
                wx.config({
                    debug: false,
                    appId: result.msg.appId,
                    timestamp: result.msg.timestamp,
                    nonceStr: result.msg.noncestr,
                    signature: result.msg.signature,
                    jsApiList: ["addCard", "hideOptionMenu"]
                });
                //�ɹ����΢�Žӿ��¼�
                coupon._bindEvents();
            }, function () {
                //��ȡ��ʼ������ʧ��
                Dialog.tips('��ȡ�ӿڳ�ʼ������ʧ�ܣ�');
            });

        },
        pushCouponToService: function (dataList) {
            io.jsonp(
                urlMap.sendCard,
                {
                    cardList: dataList
                },
                function (data) {

                },
                function () {
                }
            );
        },
        readyFunc: function () {
            $couponAddBtn.addClass("showBtn");
            $couponAddBtn.on("click", function () {
                var $this = $(this);
                if ($this.data("isClicking")) {
                    return;
                }
                $this.data("isClicking",true);
                io.jsonp(
                    urlMap.fetchCard,
                    {
                        scheme: JSON.stringify([{
                            cpnsId: parseInt($this.attr("data-cpnsid")),
                            number:1
                            //partnerKey : $this.attr("data-partnerKey"),
                            //outlucky :$this.attr("data-outlucky")=="true"?true:false
                        }])
                    },
                    function (data) {
                        if (data.error == 0 && data.msg.length!=0) {
                            WeixinJSBridge.invoke('batchAddCard', {
                                    "card_list": data.msg
                                },
                                function (res) {
                                    $this.data("isClicking",false);
                                    if(res.err_msg=="batch_add_card:ok"){
                                        coupon.pushCouponToService(res.card_list);
                                    }else{
                                        res.err_msg=="batch_add_card:cancel"? Dialog.tips('��ȯ��ȡ����������ȡ���뵽΢�ſ����в鿴^_^'):Dialog.tips('��ȯ��ȡ����');
                                    }
                                });
                        } else {
                            $this.data("isClicking",false);
                            Dialog.tips('ȯ�����꣡');
                        }
                    },
                    function () {
                        $this.data("isClicking",false);
                    }
                );
            });
        },
        getUrlParam: function (paramName) {
            var reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        init: function () {
            //�ж��Ƿ���΢�������
            if (coupon._isWeixin()) {
                //��ʼ��΢�Žӿ�
                coupon._initWXInterface();
            } else {
                Dialog.tips('��֧�ֵ�����������л���΢�������6.0���ϰ汾');
            }
        }
    };
    coupon.init();
});
