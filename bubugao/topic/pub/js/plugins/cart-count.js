/**
 * @deprecated 统一更新购物车数量
 * @author djune 2014.9.23
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery');
	var _ = require('../core/bbg');
	var eCartCount = $('.jCartCount');
	var URL = {
		MinCart: {
			getCount: 'http://api.cart.yunhou.com/cart/getSimple' // 获取购物车数量
		}
	};
	BBG.CartCount = {
		set: function(qty) {
			if (qty === undefined) {
				qty = 0;
			}
			eCartCount.html(qty);
		},
		loading: function() {
			BBG.AJAX.jsonp({
				url: URL.MinCart.getCount,
				data: {}
			}, function(data) {
				BBG.CartCount.set(data.totalType);
			}, function(data) {
				BBG.CartCount.set(0);
			});
		},
		init: function() {
			BBG.CartCount.loading();
		}
	};
	BBG.CartCount.init();
});