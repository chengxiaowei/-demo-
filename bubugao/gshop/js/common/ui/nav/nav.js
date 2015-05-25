define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var io = require('common/kit/io/request');

    var getSimple = require('common/widget/get-simple');

    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    var Dialog = require('common/ui/dialog/dialog');

    var nav = null;

    nav = function(options){
    	this.extentOpts(options);
        this.init();
    }

    nav.prototype = {
    	opts : {
    		nav : '#jNav',
            mask : '#jMask',
            clickBtn: '',//点击的按钮
            modBox : '#jModCart',//盒子对象
            isShowCloud : true,//是否展示云朵标示
            onClick : function(){},//点击事件
    		arrow : '#jArrow',
    		navLogo : '#jNavLogo',
    		isScroll : true,
    		direction : 'left',
    		distance : '-100%',
            isShow : false,
            area: 'body',
            wxUrl : '//m.yunhou.com/ump/getJs',	//获取微信参数
            wxBtn : '#jWxScan',
            urlReg : '^(http|https):\/\/(\w*\.)+(yunhou)+(\.com\/)'
            // urlReg : /^(http|ftp|https):\/\/[\w\-_]+(\.[yunhou]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/
    	},

    	extentOpts: function(options) {
            this.opts = $.extend(this.opts, options);
        },

        init: function(){
            var self = this;
            $(self.opts.area).append(self.createDiv());
            if(self.isWeixin()){
            	$(self.opts.nav).addClass('wx-fix-nav');
            	$(self.opts.wxBtn).show();
            	self.wxConfig();
            }
            if(this.opts.isShow){
                $(self.opts.nav).css('left',0).show();
            }else{
                if(self.opts.isShowCloud){
                    $(self.opts.nav).css('left','-100%').show();
                }
            }
            new getSimple();

            self.clickEvent();
            self.scrollEvent(); 
        },
        //生成盒子
        createDiv : function(){
            var self = this;
            var div = '';
            div +=  '<div class="fix-nav" id="jNav">';
            div +=      '<div class="nav-list">';
            div +=          '<a href="//m.yunhou.com/">';
            div +=              '<i class="icon iconfont">&#xe606;</i>';
            div +=              '<p>首页</p>';
            div +=          '</a>';
            div +=          '<a href="//m.yunhou.com/category/">';
            div +=              '<i class="icon iconfont">&#xe636;</i>';
            div +=              '<p>分类</p>';
            div +=          '</a>';
            div +=          '<a href="//m.yunhou.com/html/cart/cart.html">';
            div +=              '<i class="icon iconfont">&#xe605;<span class="buy-num" id="jGetSimple"></span></i>';
            div +=              '<p>购物车</p>';
            div +=          '</a>';
            div +=          '<a href="//m.yunhou.com/member/">';
            div +=              '<i class="icon iconfont">&#xe607;</i>';
            div +=              '<p>我的</p>';
            div +=          '</a>';
            div +=          '<a href="javascript:;" id="jWxScan" class="wx-scan">';
            div +=              '<i class="icon iconfont">&#xe637;</i>';
            div +=              '<p>扫一扫</p>';
            div +=          '</a>';
            div +=      '</div>';
            //
            if(self.opts.isShowCloud){
                div +=      '<span class="arrow" id="jArrow"><i class="icon iconfont">&#xe60d;</i></span>';
                div +=      '<span class="nav-logo" id="jNavLogo"><i class="icon iconfont">&#xe61b;</i></span>';
            }
            div +=  '</div>';
            if(!self.opts.isShowCloud){
                div += '<div class="tips-mask" id="jMask"></div>'
            } 
            return div;
        },
        clickEvent : function(){
        	var self = this;
            $(self.opts.navLogo).add(self.opts.clickBtn).add(self.opts.mask).on('click',function(){
                var $nav = $(self.opts.nav); 
                var $mask = $(self.opts.mask);
                var isShow = $mask.is(':visible'); 
                if(self.opts.isShowCloud){
        		  $nav.css(self.opts.direction,0);
                }else{
                    $mask[isShow?'hide':'show']().css({'opacity':'0.5'});
                    $nav[isShow?'hide':'show']();
                    $('html')[isShow?'removeClass':'addClass']('bd-hidden');
                }
                $(self.opts.navLogo).css('opacity',0);
                self.opts.onClick();
        	});
            $(self.opts.arrow).on('click',function(){
        		$(self.opts.nav).css(self.opts.direction,'-100%');
                $(self.opts.navLogo).css('opacity',0.4);
        	});
        },

        scrollEvent : function(){
        	var self = this;
        	if(!self.opts.isScroll){
        		window.onscroll = null;
        		return false;
        	}
        	window.onscroll = function(){
                if(self.opts.isShowCloud){
                    $(self.opts.nav).css(self.opts.direction,'-100%');
                    $(self.opts.navLogo).css('opacity',0.4);
                }
        	}
        },
        //微信扫一扫功能 update leaytam
        wxEvent: function(){
        	var self = this;
			$('body').on('click',self.opts.wxBtn,function(){
                Dialog.tips('微信扫一扫正在启动，请稍后...');
                self.wxReady();
			});
        },
        //微信配置消息
        wxConfig: function(result){
            var self = this;
            io.jsonp(self.opts.wxUrl,{
                url:window.location.href
            },function (result) {
                wx.config({
                    debug: false,
                    appId: result.msg.appId,
                    timestamp: result.msg.timestamp,
                    nonceStr: result.msg.noncestr,
                    signature: result.msg.signature,
                    jsApiList: ["scanQRCode"]
                });

                self.wxEvent();
                
                //处理微信config
                wx.error(function(res){
                    Dialog.tips('微信数据初始化失败，请稍后重试！');
                });
            }, function () {
                //拉取初始化参数失败
                Dialog.tips('获取接口初始化参数失败！');
            });
        },
        //微信接口准备好后调用
        wxReady: function(){
            var self = this;
            wx.ready(function(){
                wx.checkJsApi({
                    jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        if (res.checkResult.scanQRCode) {
                            self.wxScan()
                        } else {
                            Dialog.tips('请将您的微信升级到最新版！');
                        }
                    },
                    complete: function(){
                        self.wxDestory();
                    }
                });
            });
            
        },
        //微信扫一扫功能
        wxScan: function(){
            var self = this;
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    var reg = new RegExp(self.opts.urlReg);
                    if(reg.test(result)){
                        window.location.href = result;
                    }else{
                        Dialog.tips('扫一扫仅支持yunhou.com下的链接');
                    }
                },
                fail: function(){
                    Dialog.tips('摄像头信息获取失败，请重新打开试试！');
                }
            });
        },
        //判断是否是微信浏览器
        isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        wxDestory: function(){
            $('#_dialog') && $('#_dialog').remove();
        }
    }

    return nav;
    
});
