define(function(require, exports, module) {
    'use strict';
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');

    var $time = $('#jTime');
 	function timeOut($this){
 		var num = parseInt($this.html());
 		num==0 ? window.location.href = $this.siblings('a').attr('href') : num--;
 		$this.html(num);
 		setTimeout(function(){
 			timeOut($this);
 		},1000);
 	}
 	$time && timeOut($time);

 	var Dialog = require('dialog');
    var validate = require('validate');
 	var form = $('#jForm');
     //表单验证 
    var opt ={
        submitHandler:function(){ 
            BBG.AJAX.jsonp({"url":form.attr('action'),"data":form.serializeJson()},function(){
                BBG.Dialog.ok('提交成功！');
                var url = form.attr('data-url');
                if(url!=''){
                    window.location.href = url;
                }else{
                    window.location.href = 'http://www.yunhou.com';
                }

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
    var messages = {
		mobile : '请填写正确的手机号码！'
	}  
	$.extend($.validator.messages ,messages);

    $('#jSave').click(function(){ 
        form.validate(opt);
        $(this).submit();
    });

    var yhbox = $('.customer-app-box');
    $('#jApp input[name=radio-1]').click(function(){
    	if(this.value==3){
    		yhbox.show();
    	}else{
    		yhbox.hide();
    	}
    })
    yhbox.find('.jClose').click(function(){
    	yhbox.hide();
    })

});