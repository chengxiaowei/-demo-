define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var io = require('common/kit/io/request');
    //导航
    var nav = require('common/ui/nav/nav'); 
    new nav({ 
        clickBtn : '#jCategory', 
        isShowCloud : false 
    });
    
    var lazyMore = function(){
        new Lazyload('.jPage', {
            type: 'html',
            placeholder: '<div class="loading">正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                var data = {
                	'callback': 'callback',
                    'page': page,
                    'goods_id': gGoodsId,
                    'product_id': gProductId,
                    'type': getQueryString('type')
                };
                if(!$(el).hasClass('load')){
                    var src = '/item/commentList';
                    io.jsonp(src, data, function(data) { 
                    	if(data.html == ''){
                    		$(el).remove();
                    		return false;
                    	}
                    	else{
                    		var html = unescape(data.html);
	                        $(el).html(html).addClass('load'); 
	                        $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
	                        lazyMore();
                    	}
                        
                    },function(){
                        $(el).find('.loading').html('网络错误，点击重试').attr('id','jNetError');
                    });
                }
            }
        });
    }
    
    lazyMore();

    //列表加载网络出错，重试
    $('body').on('click','#jNetError',function(){
        lazyMore();
    })

	function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

});
