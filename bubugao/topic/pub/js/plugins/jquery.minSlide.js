/**
 * @deprecated 搜索栏广告插件
 * @author djune 2014.8.16
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery');
	var _ = require('../core/bbg');
	$.fn.minSlide = function(options) {
		var defautls = {
			attr: 'data-url', // 实际的地址
			duration: 5000, // 每个多久轮播一次
			callback: function() { // 每次轮播完成后的回调
			}
		};
		var opt = $.extend({}, defautls, options || {});

		$(this).each(function() {
			var $this = $(this),
				eCnt = $this.find('.min-slide-cnt'),
				eLi = eCnt.find('li'),
				itemCount = eLi.length, // 总条数
				offset = $this.height(), // 位移
				curIndex = 0, // 当前页
				isStop = false; // 是否停止动画
			var Slide = {
				init: function() {
					Slide.setCurrent();
					Slide.initEvent();
				},
				setCurrent: function() {
					var curLi = eLi.eq(curIndex),
						_offset = -curIndex * offset,
						_img = curLi.find('img'),
						_imgUrl = _img.attr(opt.attr);
					eCnt.animate({
						top: _offset
					});
					if (_imgUrl) {
						BBG.IMG.load(_imgUrl, function() {
							_img.attr('src', _imgUrl);
							_img.removeAttr(opt.attr);
							_img.removeClass('img-error');
						});
					}
				},
				initEvent: function() {
					if (opt.duration > 0) {
						isStop = false;
						eCnt.hover(function() {
							isStop = true;
						}, function() {
							isStop = false;
						});
						var clearTime = setInterval(function() {
							if (!isStop) {
								curIndex++;
								if (curIndex >= itemCount) {
									curIndex = 0;
								}
								Slide.setCurrent();
							}
						}, opt.duration);
					}
				}
			};
			Slide.init();
		})
	};
});