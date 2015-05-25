define(function(require, exports, module) {
    'use strict';
	var $ = require('jquery'),
		 _  = require('pub/core/bbg'),
		 countDown = require('pub/plugins/jquery.countDown'),
		 Dialog = require('pub/plugins/dialog'); 
		 
	//专题倒计时
	BBG.topicTimeOut = function(){
		if(typeof(topic)==='object'){
			var opts = {
				end_time:'',
				end_url:'http://www.yunhou.com',
				end_notice:'还有很多精彩优惠活动正在进行<br/>走起，开始抢吧~<br/>再犹豫犹豫就晚了',
				isShowTime:false,
				isTest:false
	        };
	        opts = $.extend({}, opts, topic);
	        if(opts.end_time!=''){ 
	        	BBG.AJAX.jsonp({'url':'http://api.mall.yunhou.com/time'},function(data){
	        		if(parseInt(opts.end_time)>parseInt(data)){
	        			var $tpTime = $('<div class="hidden">专题活动还剩余<span data-endtime="'+parseInt(opts.end_time)+'" data-starttime="'+parseInt(data)+'"></span>结束！</div>');
	        			$('body').append($tpTime);
	        			if(opts.isShowTime){
	        				$tpTime.removeClass('hidden');
	        			}
	        			if(opts.isTest){
	        				stopTime(opts);
	        			}
	        			countDown({ 
			                timeText : ['天','时','分','秒'],
			                container : $tpTime.find('span'),
			                isShowTimeText : true,
			                type : {
			                    'd' : true,
			                    'h' : true,
			                    'm' : true,
			                    's' : true
			                },
			                callback : function() {
			                   stopTime(opts);
			                }
			            }); 
	        		}else if(parseInt(opts.end_time)>0 || opts.isTest){
	        			stopTime(opts);
	        		}
	        	});
	        }
	       	var stopTime = function(opts){
	       		var cont = '<div class="topic-dialog-cnt">';
    				cont += '<p>'+opts.end_notice+'</p>';
    				cont += '<p class="tp-dialog-time"><span>10秒钟</span>后，去看更多优惠</p>';
    				cont += '</div>';
    			 BBG.Dialog.pop({
    			 	id:'jCloseTopic',
    			 	skin:'topic-dialog-box',
    			 	width:622,
    			 	height:468,
    			 	content:cont,
    			 	fixed:true,
    			 	okValue:'去瞧瞧',
    			 	ok:function(){
    			 		window.location.href = opts.end_url;
    			 	}
    			 });
    			 if(Dialog.list['jCloseTopic'] && opts.end_url != ''){
    			 	var $time = $(Dialog.list['jCloseTopic'].node).find('.tp-dialog-time span');
				 	var timeOut = function ($this){
				 		var num = parseInt($this.html()); 
				 		num==0 ? window.location.href = opts.end_url : num--;
				 		$this.html(num+'秒钟');
				 		setTimeout(function(){
				 			timeOut($this);
				 		},1000);
				 	}
				 	$time && timeOut($time);
    			 }
	       	}
		}
	}
	
	//专题倒计时
	BBG.topicTimeOut();
	
});