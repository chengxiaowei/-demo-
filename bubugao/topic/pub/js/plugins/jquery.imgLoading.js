/**
 * @deprecated 滚屏图片懒加载
 * @author djune 2013-10-15
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery');
	var _ = require('../core/bbg');
	$.fn.imgLoading = function(options) {
		var defautls = {
			range: 50, // 多加载部分，提高用户体验，暂不支持
			attr: 'data-url', // 实际的地址
			selector: 'img', // 需要做处理的
			container: $(window), // 容器
			isFade: true, // 是否支持动画
			model: 'y', // 目前支做垂直方向，因为水平方向暂时没这个需求
			attrBg: 'data-bg',
			callback: function() {},
			errorFun: function() {

				} //错误的回调
		};
		var opt = $.extend({}, defautls, options || {}),
			arrImg = [];

		if (opt.isFadeTo) {
			$(this).css({
				'opacity': '0.6'
			});
		}

		var contentOffsetTop = 0
			// 如果是非windows
		if (!(opt.container.get(0) == window)) {
			contentOffsetTop = opt.container.offset().top;
		}

		// 缓存
		$(this).each(function() {
			var obj = $(this);
			var curTop = obj.offset().top - contentOffsetTop;
			var curHeight = curTop + obj.height() + opt.range;
			arrImg.push({
				obj: obj,
				curTop: curTop,
				curHeight: curHeight
			});
		});

		var loading = function() {
			// 容器的height和scrollTop
			var contentHeight = opt.container.height(),
				contentTop = opt.container.scrollTop();

			$.each(arrImg, function(i, data) {
				var obj = data.obj,
					url = obj.attr(opt.attr);
				if (obj.attr('src') == '') {
					obj.attr('src', 'http://s1.bbgstatic.com/pub/img/blank.gif');
				}
				if (url) {
					// 当前元素的height和scrollTop
					var curTop = data.curTop,
						curHeight = data.curHeight;
					var flag = !((curTop > (contentTop + contentHeight)) || (curHeight < contentTop));
					// 可是区域的图片显示
					if (flag) {
						// 判读图片是否加载完成
						if (obj.attr(opt.attr) && obj.attr(opt.attr).length > 0) {
							BBG.IMG.load(url, function() {
								var attrBg = obj.attr(opt.attrBg);
								if (attrBg && attrBg == 'lazyload') {
									obj.css('background-image', 'url(' + url + ')');
								} else {
									obj.attr('src', url);
									obj.removeClass('img-error');
									if (opt.isFadeTo) {
										obj.fadeTo('normal', 1);
									}
								}
								opt.callback && opt.callback(obj);
							}, function() {
								$(this).css({
									'opacity': '1'
								});
								opt.errorFun && opt.errorFun();
								return false;
							});
						}
						obj.removeAttr(opt.attr);
					}
				}
			});
		};
		loading();
		opt.container.bind('scroll', loading);
		opt.container.resize(loading);
	};
	// 初始化默认
	$('.jImg').imgLoading();
});