define(function(require, exports, module) {
    'use strict';

     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');require('pub/plugins/login-dialog');

    var $btn = $('#jBtn'),$form = $('#jForm'),$jApp = $('#jApp');  
    	$btn.click(function(){
    		var $txt = $(this).siblings('input').val();

    		if($txt!=''){
    			if(!(/^[A-Za-z0-9 \u4e00-\u9fa5]{2,8}$/).test($txt)){
    				BBG.Dialog.error('请输入中文、数字或英文！');
    				return false;
    			}
    			queryData({'url':BBG.phpUrl+'/actcoupon/create','data':{'code':$txt}}, function(data) {}, function(data){
                    if (data._error.code == 600) {
                        BBG.Login.dialog(function(){
                            window.location.reload();
                        });
                    }
                    else {
                        BBG.Dialog.error(data._error.msg);
                    }
    			});
    		}else{
    			BBG.Dialog.error('请输入您的名字！');
    		}
        });
        /*填充数据*/
        function queryData(opt,succCallBack,errorCallBack){
        	BBG.AJAX.jsonp(opt,function(data){
				if(data){ 
					if(data.money){
						$form.find('.cnt-title').html('至2015年1月1日，施主已累计消费<span class="cl-r">'+data.money+'</span>元，可生成一张<span class="cl-r">'+data.discount+'</span>扣优惠券');
					}else if(data.code){
						$form.find('.cnt-form-m').show().html('施主的专属优惠券码：<span class="cl-r">'+data.code+'</span>');
						$form.find('.cnt-form-tm').html('：'+data.code+'，即可享受相应折扣。（本券每个用户ID可重复享受三次折扣,单笔订单最高优惠50元！）');
						$jApp.find('.jAppImg').attr('src',data.qr_url);
						$jApp.show(); 
						BBG.AJAX.jsonp({'url':BBG.phpUrl+'/actcoupon/uselist','data':{'code':data.code}},function(data){
							if(data.list.length>0){
								var  $phoneList = $('#jPhoneList');
								$phoneList.find('.cnt-info-num span').html(data.use_times);
								$phoneList.find('dl').show();
								$.each(data.list,function(i){
                                    data.list[i] = '<span class="cl-w">'+data.list[i]+'</span>';
								});
                                $phoneList.find('dd').append(data.list.join('&nbsp;&nbsp;'));
							}
						});
					} 
					succCallBack && succCallBack(data);
				}
			},function(data){
                errorCallBack && errorCallBack(data);
			},$btn);
        }
        
        queryData({'url':BBG.phpUrl+'/actcoupon/level','isBegin':false}, function(data) {
            if (data.money != '') {
                setTimeout( function() { 
                    queryData({'url':BBG.phpUrl+'/actcoupon/query'}, function(data) {
                        if (!data.code) {
                            $('.cnt-txt-box').show();
                        }
                    }) 
                }, 200);     
            }
        }, function() { $('.cnt-txt-box').show(); });
});
