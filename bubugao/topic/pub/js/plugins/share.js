/**
* @description 分享插件
* @author licuiting 250602615@qq.com
* @date 2015-01-21 17:49:26
* @version $Id$
*/
define(function(require, exports, module) {
	'use strict';

    require('../core/bbg');

	function Share(opt){
		this.defaultSetting=$.extend( this, this.defaultSetting, opt ||{});
		this.init();
	}
	Share.prototype={
		defaultSetting : {
			title : document.title,//标题
			url : document.URL,//链接
			pic:'',//图片url
			target : '_blank',
			//分享的选择器
			shareSelector : {
				qzone : '.jShareQzone',
				sina : '.jShareSina',
				qq : '.jShareQQ',
				renren : '.jShareRenRen'
			}
		},
		init:function( ){
			var self = this;
			//self.title = self.getTitle();
			self.createHref();
			self.bindEvent();
		},
		getTitle : function( ){
			var self = this;
			var $title = $('[data-share-title]');
			var tit = $title.attr('data-share-title');
			var _title = self.title;
			if($title.length!=0 && $.trim(tit).length!=0 && tit!=null){
				_title = $.trim(tit);
			}
			return _title;
		},
		//分享的内容
		urlAr : function(){
			return {
				qzone :'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=',
		        sina : 'http://v.t.sina.com.cn/share/share.php?url=', 
		        qq : 'http://connect.qq.com/widget/shareqq/index.html?url=',
		        renren : 'http://widget.renren.com/dialog/share?resourceUrl='
		    };
		},
		//生成href
		createHref : function(url){
			var self = this;
			url ? self.url = url : '';
			$.each(self.shareSelector, function(k, v){
				var hrefUrl = self.urlAr()[k]+encodeURIComponent(self.url)+'&title='+encodeURIComponent(self.title)+'&pic='+encodeURIComponent(self.pic);
				if(k=='qzone')
					hrefUrl =  hrefUrl.replace(/\&pic/g,'&pics');
				else if(k=='renren')
					hrefUrl += '&srcUrl='+self.url;
				$(v).attr({'href': hrefUrl,'target': self.target});
			});
			$.cookie('_nick') ? $(self.shareSelector.qq).parents('div.share-div').addClass('share-money') : ''; 
		},
		bindEvent : function(){
			var self = this,$parent = $(self.shareSelector.qq).parents('div.share-div');
			$parent.delegate('a','click',function(){
				var $this = $(this); 
				if($.cookie('_nick') && !$parent.hasClass('disabled') && gProductId && gProductId>0){ 
					BBG.AJAX.jsonp({
						url : 'http://api.mall.yunhou.com/Union/getShareUrl',
						data : {'product_id' : gProductId }
					}, function(data) {
						$(self.shareSelector.qq).parents('div.share-div').addClass('share-money').addClass('disabled');
						data && self.createHref(data.url); 
						$this[0].click();
					});
					return false;
				}
			});
		}
	}
	return function(opt){
		new Share(opt);
	}
});
