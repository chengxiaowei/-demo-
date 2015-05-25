/**
 * @deprecated 加入购物车 不需要额外加载样式文件
 * @author djune 2014.7.21
 */
 
 define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var bbg = require('../core/bbg');
	var MinBar = require('./min-bar');
	var _ = require('./cart-count');
		_ = require('./dialog');
	
	$.fn.addCart = function(options) {
		var _this = $(this);
		var defautls = {
			target : $('#jMinCart'),// 目标元素，jquery对象，如果
			url : BBG.URL.Cart.add,
			data : {
				quantity : 1
			},
			img : null,// 如果设置了img就忽略attr.img
			event : false,// 事件类型,与jquery事件类型一致，如果是false，则由外部促发
			styles : {
				'width' : 30,
				'height' : 30,
				'border' : '2px solid #db0000',
				'id' : '__addCartCnt',
				'z-index' : 200,
				'position' : 'absolute',
				'text-align' : 'center',
				'border-radius' : '50%',
				'background-color' : 'rgb(255,255,255,0.5)',
				'display' : 'none'
			},

            // add by taotao
            successAddtoCart: function() {},
			/**
			 * 加入购物车回调函数
			 *
			 * @param data
			 *            {Object} 返回值
			 */
			callback : function(data, obj) {
				if (data._error) {
					if(data._error.code=='-600'){
						//弹出登陆框
						BBG.Login.dialog();
					}else{
						BBG.Dialog.error(data._error.msg, obj);
					}
				} else {
					MinBar.Plug.Cart.updateQty(data.totalType);
					_this.removeClass('btn-disabled');
					_this.prop('disabled', false);
                    this.successAddtoCart && this.successAddtoCart();
				}
			}
		};

		var opt = $.extend(true, {}, defautls, options || {});// 正在加载中

		var Cart = {
			init : function() {
				Cart.img.css(opt.styles);
				$(document.body).append(Cart.img);
			},
			img : $('<img />', {
				src : '//s1.bbgstatic.com.com/pub/img/blank.gif'
			}),
			setImg : function(src) {
				BBG.IMG.load(src, function() {
					Cart.img.attr('src', src);
				});
			},
			move : function(curObj) {
				if (opt.target && opt.target.length > 0) {
					var _data = $.extend(true, {}, {
						productId : curObj.attr('data-product-id')
					}, opt.data);
					BBG.AJAX.jsonp({
						url : opt.url,
						data : _data
					}, function(data) {
						// 如果成功回调
						var fromOffset = curObj.offset();
						var toOffset = opt.target.offset();
						if (opt.img) {
							Cart.setImg(opt.img);
						} else {
							Cart.setImg(curObj.attr('data-img'));
						}
						Cart.img.css({
							display : 'block',
							opacity : '1',
							top : fromOffset.top - curObj.outerHeight(),
							left : fromOffset.left + curObj.outerWidth() / 2
						});
						Cart.img.stop().animate({
							top : toOffset.top,
							left : toOffset.left - Cart.img.outerWidth()
						}, "normal", function() {
							Cart.img.animate({
								opacity : '.5',
								top : toOffset.top + opt.target.outerHeight() / 2,
								left : toOffset.left
							}, function() {
								Cart.img.css({
									opacity : '0',
									display : 'none'
								});
								opt.callback && opt.callback(data, curObj);
							});
						});
					}, function(data) {
						opt.callback && opt.callback(data, curObj);
					}, curObj);
				}
			}
		};

		Cart.init();

		$(this).each(function() {
			var $this = $(this);
			if (opt.event) {
				$this.on(opt.event, function() {
					Cart.move($this);
				});
			} else {
				Cart.move($this);
			}
		});
	}
});
