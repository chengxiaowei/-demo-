/**
 * @desc 慧生活
 *
 * @author jiangchaoyi update 2014.11.8
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery');
	var _bbg = require('../core/bbg');
	var _slide = require('./jquery.slide');
	var _json = require('./json2');
	/**
	 * localStorage 常用操作集合
	 */
	var LS = window.LS = {
		isSupport: window.localStorage ? true : false,
		get: function(key) {
			if (!LS.isSupport) {
				return false;
			}
			var key = localStorage.getItem(key);
			try {
				key = JSON.parse(key);
			} catch (e) {}
			return key;
		},
		set: function(key, val) {
			if (!LS.isSupport) {
				return false;
			}
			//写之前先清除，防止iphone、ipad等报错
			localStorage.removeItem(key);
			localStorage.setItem(key, JSON.stringify(val));
		}
	};

	/**
	 * 从缓存获取数据
	 * @param  {[jquery element]} elm 需要加载数据的元素
	 * @param  {[function]} okFn    加载数据成功后的回调
	 * @param  {[function]} errorFn 加载数据失败后的回调
	 * @return {[void]} 无返回值
	 */
	/**
	 * [loadData description]
	 * @param  {[object]} opt 配置信息 见defaluts
	 */
	function loadData(opt) {
		var defaults = {
			elm: null,
			okFn: $.noop(),
			errorFn: $.noop(),
			isCache: true
		};
		var opt = $.extend(defaults, opt),
			elm = opt.elm;
		if (elm && elm.length === 0) {
			return;
		}
		if (opt.isCache) {
			var path = elm.attr("data-path"),
				lmt = elm.attr("data-lmt"),
				key = LS.get(path);
			if (key && key.lmt && key.lmt == lmt) {
				elm.html(unescape(key.cacheData));
				elm.find('.jImg').imgLoading();
				opt.okFn && opt.okFn(key);
				return;
			}
			elm.addClass('load-floor');
			_ajax(elm, function(data) {
				var lsCache = {
					cacheData: escape(data),
					lmt: lmt
				};
				LS.set(path, lsCache);
				elm.removeClass('load-floor');
				opt.okFn && opt.okFn(data);
			}, function(data) {
				opt.errorFn && opt.errorFn(data);
			});
		} else {
			_ajax(elm, function(data) {
				opt.okFn && opt.okFn(data);
			}, function(data) {
				opt.errorFn && opt.errorFn(data);
			});
		}
	}

	function _ajax(elm, okFn, errorFn) {
		var path = elm.attr("data-path");
		if (!path) {
			elm.find('.jImg').imgLoading();
			return;
		}
		var opt = {
			url: path,
			dataType: 'jsonp'
		};
		BBG.AJAX.ajax(opt, function(data) {
			//为空就不缓存
			if (!data || $.trim(data).length == 0 || data == null) {
				return;
			}
			elm.html(data);
			elm.find('.jImg').imgLoading();
			okFn && okFn(data);
		}, function(data) {
			errorFn && errorFn(data);
		});
	}

	return loadData;
});