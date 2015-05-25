define(function(require, exports, module) {
    'use strict';
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
    var Dialog = require('pub/plugins/dialog');
    var validate = require('pub/kit/validate/jquery.validate');

	var $tab = $('.tab-cnt');
	$('.jImg-0').imgLoading();
	$('#jNavList li').click(function(){
		var index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$tab.eq(index).addClass('active').siblings().removeClass('active');
		$('.jImg-'+index).imgLoading();
		$('input[name=houses]').val($(this).attr('data-name'));
	});

	 

	var form = $('.pop-form');
     //表单验证 
    var opt ={
        submitHandler:function(){ 
            BBG.AJAX.post({"url":form.attr('action'),"data":form.serializeJson()},function(){
                BBG.Dialog.ok('预约成功！');
                setTimeout(function(){
                    window.location.href = window.location.href;
                },5000);
            },function(data){
                BBG.Dialog.error(data._error.msg);
            },$('#jSave'));
        },
        //弹窗错误提示操作
		errorPlacement : function(error, element) { 
			if(error.text() != ""){ 
				if(Dialog.list[element[0].name]){
					Dialog.list[element[0].name].content(error.html());
				}else{ 
					BBG.Dialog.errorTip(error.html(),element,element[0].name);
					element.focus();
				}
			}
		},
		//弹窗成功操作
		success : function(laber,element){ 
			if(element){
				if(Dialog.list[element.name])
					Dialog.list[element.name].remove();
			} 
		}
    } 
    form.find('p:eq(0)').css('margin','0');
    var messages = {
		mobile : '请填写正确的手机号码！'
	}  
	$.extend($.validator.messages ,messages);

    $('#jSave').click(function(){ 
        form.validate(opt);
        $(this).submit();
    });

    var $header = $('#jHeader'),top = $header[0].offsetTop;
 	function scrollTop(){
 		var bodyScrollTop =  parseInt($(document).scrollTop());
 		//console.log('bodyScrollTop:'+bodyScrollTop+' top:'+top);
 		if(bodyScrollTop >= top){
 			$header.addClass('fixed');
 		}else{
 			$header.removeClass('fixed');
 		}
 	};
 	scrollTop();
 	$(window).bind('scroll.lazyload resize.lazyload',function(){
		scrollTop();
	});
})