 /**
  * @description 搜索关键字
  * @author licuiting 250602615@qq.com
  * @date 2014-11-26 11:35:58
  * @version $Id$
  */
 define(function(require, exports, module) {
 	'use strict';
 	//import public lib
 	var $ = require('jquery');
 	var _ = require('../../core/bbg');
 	var URL = {
 		SEARCH: {
 			// 关键字
 			keyword: 'http://api.mall.yunhou.com/HotKeyword/getHotKeywords'
 		}
 	};
 	//class
 	function SearchKeyWord(opt) {
 		$.extend(this, this.defaultSetting, opt || {});
 		this.init();
 	};
 	SearchKeyWord.prototype = {
 		defaultSetting: {
 			url: URL.SEARCH.keyword
 		},
 		init: function() {
 			this.loadKeyWord();
 		},
 		// 加载关键字
 		loadKeyWord: function(callback) {
 			var _self = this;
 			var cateId = ($('#hide_cateId').val() ? $('#hide_cateId').val() : '0');
 			cateId = (cateId == '' ? '0' : cateId);
 			BBG.AJAX.jsonp({
 				url: _self.url,
 				data: {
 					count: 10,
 					cateId: 9,
 					url: location.href
 				}
 			}, function(res) {
 				if (res && res.data && res.data != '' && res.data.length != 0) {
 					_self.selector.html(_self.createDiv(res.data));
 					callback && callback(res.data);
 				}
 			})
 		},
 		// 创建div 
 		createDiv: function(data) {
 			var ar = [];
 			var getExtraParams = window['gShopType'] === 4 ? function() {
 				return 'st=4';
 			} : function() {
 				return '';
 			};
 			$(data).each(function(i, v) {
 				var params = v.paras || getExtraParams();
 				params = params ? ('&' + params) : '';
 				ar.push('<a href="http://search.yunhou.com?k=' + encodeURIComponent(v.keyword) + params + '"  target="_blank" data-bpm="' + (v.bpm ? v.bpm : '') + '">' + v.keyword + '</a>')
 			});
 			return ar.join('');
 		}
 	}

 	$.fn.searchKeyWord = function(opt) {
 		opt = opt || {};
 		opt.selector = $(this);
 		new SearchKeyWord(opt);
 	};

 	return function(opt) {
 		new SearchKeyWord(opt);
 	}
 });