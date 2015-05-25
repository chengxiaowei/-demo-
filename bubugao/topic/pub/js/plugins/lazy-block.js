/**
 * @desc 首页模块懒加载
 *
 * @author jiangchaoyi update 2014.11.8
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery');
	var _bbg = require('../core/bbg');
	var boxResize = require('./jquery.ba-resize');
	/**
	 * 楼层懒加载
	 */
	function lazyBlock(opt) {
		var defaultSetting = {
			selector: null,
			isCache: true, //是否缓存
			range: 200,
			container: window,
			isLazy: true, //是否支持懒加载
			callback: function() {}
		};
		opt = $.extend(true, defaultSetting, opt);
		var eSelector = $(opt.selector);
		if (opt.selector.length === 0) {
			return;
		}
		var eCnt = $(opt.container),
			cntH, cntTop, cntBtm;

		/**
		 * 是否在范围内
		 */
		function _isInRange(elm) {
			var curH = elm.outerHeight(),
				curTop = elm.offset().top,
				curBtm = curTop + curH;
			if (!(curBtm < cntTop || curTop > cntBtm)) {
				return true;
			}
			return false;
		}

		function _loading() {
			cntH = eCnt.height(),
				cntTop = eCnt.scrollTop(),
				cntBtm = cntTop + cntH + opt.range;
			eSelector.each(function() {
				var self = $(this);
				if (self.data('inited') != 'inited') {
					if (opt.isLazy) {
						if (_isInRange(self)) {
							opt.callback && opt.callback(self);
							self.data('inited', 'inited');
						}
					} else {
						opt.callback && opt.callback(self);
						self.data('inited', 'inited');
					}
				}
			});
		};
		_loading();
		if (opt.isLazy) {
			eCnt.bind("scroll", _loading);
			eCnt.resize(_loading);
			$('body,html').resize(_loading);
		}
	}



	return lazyBlock;
});