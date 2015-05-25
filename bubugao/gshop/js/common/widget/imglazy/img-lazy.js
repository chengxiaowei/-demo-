/**
 * @deprecated 滚屏图片懒加载
 * @author leay 2014-12-11
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
	exports.imgLazy = function(options) {
		var opts = $.extend({
			imgEl:'.jImg',	//懒加载的元素
			attr : "data-url",// 实际替换的图片
			container : window,// 指定容器内加载
			range : 100,// 阀值，为正值则提前加载
			isVertical : true,	//竖向为true,横向为false
			callBack : function() {
			}
		}, options);
		var viewPort = $(opts.container), isVertical = opts.isVertical, _cache = [];
		var OFFSET = {
			win : [ opts.isVertical ? 'scrollY' : 'scrollX', opts.isVertical ? 'innerHeight' : 'innerWidth' ],
			img : [ opts.isVertical ? 'top' : 'left', opts.isVertical ? 'height' : 'width' ]
		};
		var isWindow = (opts.container === window ? true : false);

		!isWindow && (OFFSET['win'] = OFFSET['img']);// 若container不是window，则OFFSET中取值同img

		function isInViewport(offset) {// 图片出现在可视区的条件
			var viewOffset = isWindow ? window : viewPort.offset(), 
				viewTop = viewOffset[OFFSET.win[0]], 
				viewHeight = viewOffset[OFFSET.win[1]], 
				imgTop = offset[OFFSET.img[0]], 
				imgHeight = imgTop + offset[OFFSET.img[1]];
			if ((imgTop >= viewTop && imgTop <= viewTop + viewHeight + opts.range) || (imgHeight >= viewTop && imgHeight <= viewTop + viewHeight + opts.range)) {
				return true;
			}
			return false;
		}
		$(opts.imgEl).each(function() {
			_cache.push($(this));
		});
		var imgLoad = function(src, fnSucceed, fnError) {
			var objImg = new Image();
			objImg.src = src;
			if (objImg.complete) {
				fnSucceed && fnSucceed();
			} else {
				objImg.onload = function() {
					fnSucceed && fnSucceed();
				};
			}
			objImg.onerror = function() {
				fnError && fnError();
			};
		}
		var loading = function() {
			$.each(_cache, function(i, obj) {
				if (obj) {
					var url = obj.attr(opts["attr"]);
					// 可是区域的图片显示
					if (isInViewport(obj.offset())) {
						if (url && url.length > 0) {
							// 判读图片是否加载完成
							if (obj.attr(opts["attr"]) && obj.attr(opts["attr"]).length > 0) {
								imgLoad(url, function() {
									obj.attr("src", url);
									obj.removeAttr("width");
									obj.removeAttr("height");
									opts.callBack.call(opts.callBack);
									_cache[i] = null;
								}, function() {
								});
							}
							obj.removeAttr(opts["attr"]);
						}
					}
				}
			});
		};
		loading();
		viewPort.bind("scroll", loading);
	};
});
