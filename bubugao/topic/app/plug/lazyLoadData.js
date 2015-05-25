define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery'),
		 _  = require('pub/core/bbg'),
		loadData = require('pub/plugins/load-data'),
		lazyBlock = require('pub/plugins/lazy-block'),
		floorTab = require('app/plug/floorTab'),
		addTag = require('pub/plugins/add-tag'),
		getProductIcon = require('pub/plugins/get-product-icon');//获取商品标签
		
	//模块懒加载
	BBG.lazyLoadMod = function(){
	    var eFloorItem = $('.jFloor'); 
			
		    /* 新品上市 */
		    eFloorItem && lazyBlock({
		        selector: eFloorItem,
		        callback: function(elm) {
		            loadData({
		                elm: elm.find('ul'),
		                okFn: function(data) {
		                	if(elm.find('li:first').length>0 && elm.attr('data-lw')){
		                		BBG.ProModLeft(elm,elm.attr('data-lw'));
		                	}
		                   $('.jFloorTab') && floorTab({
			                    selector: elm.find('.jFloorTab'),
			                    hoverClass : 'tab-title-hover'
			                });
		                   BBG.animitLi();
		                   getProductIcon({
		                        parent : elm
		                   });
		                   addTag({
		                   		parent : elm
		                   });
		                }
		            });
		        }
		    });
	};
	
	//模块抖动效果
	BBG.animitLi = function(){
		var $bd = $('.com-bd');
		$bd && $bd.find('li').hover(function(){
			$(this).stop().animate({'top':'5px'},'normal');
		},function(){
			$(this).stop().animate({'top':'0'},'normal');
		});
	};
	
	//模块左移样式
	BBG.ProModLeft = function($proList,width){
		var isIE7 = (!$.support.leadingWhitespace && navigator.appVersion.match(/7./i)=='7.');
	    $proList.each(function(){
	    	$(this).find('li:first').css({'margin-left':width+'px'});	    	 
	    	$(this).find('li:first').hover(function(){
	    		if(isIE7)
	    			$(this).css({'left':width+'px'});
	    	})
	    });
	};

    //模块懒加载
    BBG.lazyLoadMod();
	
	//模块抖动效果
	BBG.animitLi();
	
	//获取小图标
    setTimeout(function(){
        getProductIcon();
        addTag();
    }, 200);
	  
});