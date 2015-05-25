/**
 * 按需加载，滚动条滑到指定位置才加载对应模块
 * 
 * @author djune 2013-10-15
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

	$.fn.demandLoading = function(options) {
		var defautls = {
			range : 100,// 提前加载部分，提高用户体验
			attr : 'data-loading',// 是否正在加载的判断
			container : $(window),// 容器
			callback : function() {
			}
		};
		var opt = $.extend({}, defautls, options || {});

		var $this = $(this);
		var loading = function() {
			// 容器的height和scrollTop
			var eContainer = $(opt.container), contentHeight = eContainer.height(), contentTop = eContainer.scrollTop();
			$this.each(function() {
				var obj = $(this);
				// 当前元素的height和scrollTop
				var curTop = obj.offset().top - opt.range;
				var curHeight = curTop + opt.range + opt.range + obj.outerHeight();
				if (obj.attr(opt.attr)) {// 判断是否已经加载过
					var flag = !((curTop > (contentTop + contentHeight))||(curHeight < contentTop));
                    if (flag) {
						// 是否到达可视区域
						opt.callback && opt.callback();
						obj.removeAttr(opt.attr);
					}
				}
			});
		};
		loading();
		opt.container.bind("scroll", loading);
		opt.container.resize(loading);
	};
});
