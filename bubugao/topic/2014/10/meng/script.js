define(function (require, exports, module){
	'use strict';
	 var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');require('pub/plugins/login-dialog');

	$("fenxiangdiv").find('span').bind('click',function(){
		var $this = $(this);
		/*判断用户是否登录*/
		var myCookie = $.cookie('_nick');
		if(myCookie == '' || myCookie == 'undefined' || myCookie == null){
			BBG.Login.dialog();
			return;
		}
		//分享的类型id赋值，然后提交表单。
		$("#fenxiangid").attr('value',$this.find('i').html());
		$("#fenxiangsubmit").submit();
	}); 

	var mengTop = $('.meng-go').scrollTop();
	var eBody = $('body'),bodyScrollTop;
	var eMengNav = $('.meng-go'); 
	function mengNav(){
		bodyScrollTop =  eBody.scrollTop();
		if(bodyScrollTop > mengTop){
			eMengNav && eMengNav.css({
				position : 'fixed'
			}); 
		}else{
			eMengNav && eMengNav.css({
				position : 'relative'
			});
		}
	}
	mengNav();
	$(window).bind({
		'scroll' : mengNav
	});
});