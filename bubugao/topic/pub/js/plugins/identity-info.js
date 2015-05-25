/* 身份信息 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery');
	var _ = require('../core/bbg');
	var cookie = require('./jquery.cookie');
	var URL = {
		UC: {
			// 获取vip信息
			getVipInfo: 'http://i.yunhou.com/vip-card/info',
			// 登陆url
			login: 'https://ssl.yunhou.com/login/login.php',
			// 注册
			regist: 'https://ssl.yunhou.com/login/reg.php',
			// 主页
			index: 'http://i.yunhou.com/',
			// 退出
			logout: 'https://ssl.yunhou.com/bubugao-passport/logout'
		}
	};
	// 配置
	var defaultSetting = {

	};
	// 身份信息
	var identityInfo = {
		init: function() {
			this[this.status()].init();
		},
		// 返回状态信息
		status: function() {
			// 是否登陆
			var isLogin = $.cookie('_nick');
			// 是否vip
			var isVip = $.cookie('_mt') == '1';
			// 状态
			var status = 'noLanding';
			if (isLogin) {
				status = 'langded';
				if (isVip) {
					status = 'vip';
				}
			}
			return status;
		}
	};
	// 已登陆
	identityInfo.langded = {
		init: function() {
			identityInfo.selector.html(this.createDiv())
		},
		createDiv: function() {
			var ar = [];
			ar.push('<li class="sn-login-normal">您好，', '<a href="' + URL.UC.index + '">' + $.cookie('_nick') + '</a>', '<span class="split"></span>', '<a href="' + URL.UC.logout + '?returnUrl=' + encodeURIComponent(location.href) + '">退出</a>', '</li>');
			return ar.join('');
		}
	};
	// 未登陆
	identityInfo.noLanding = {
		init: function() {
			identityInfo.selector.html(this.createDiv())
		},
		createDiv: function() {
			var ar = [];
			ar.push('<li>欢迎来到云猴网！请', '<a href="' + URL.UC.login + '">登录</a>', '<span class="split"></span>', '<a href="' + URL.UC.regist + '">免费注册</a>', '</li>');
			return ar.join('');
		}
	};
	// vip
	identityInfo.vip = {
		init: function() {
			var _self = this;
			identityInfo.selector.html(_self.createDiv());
			_self.evt();
		},
		// 加载vip信息
		loadVipInfo: function(callback) {
			var _self = this;
			BBG.AJAX.jsonp({
				url: URL.UC.getVipInfo,
				data: {}
			}, function(res) {
				if (res && res.vip) {
					callback && callback(res);
				} else if (res && res._error) {
					var _code = res._error.code;
					if (_code == '-100') {
						location.href = 'https://ssl.yunhou.com/login/login.php';
					}
				}

			}, function(res) {
				if (res && res._error) {
					var _code = res._error.code;
					if (_code == '-100') {
						location.href = 'https://ssl.yunhou.com/login/login.php';
					}
				}
			})
		},
		createDiv: function(data) {
			var ar = [];
			ar.push('<li class="sn-login-vip jMenu" id="jVip">', '<a class="menu-hd block-item" href="' + URL.UC.index + '">您好，' + $.cookie('_nick') + '', '<i class="icon-vip"></i>', '</a>', '<div class="menu-bd" id="jVipCtn">', '</div>', '<a href="' + URL.UC.logout + '?returnUrl=' + encodeURIComponent(location.href) + '">退出</a>', '</li>');
			return ar.join('');
		},
		createDownDiv: function(data) {
			var ar = [];
			ar.push('<div class="vip-name">' + data.vip + '</div>', '<div class="vip-des">我的特权：' + data.info + '</div>');
			return ar.join('');
		},
		// 绑定事件
		evt: function() {
			var _self = this;
			var $ctn = $('#jVipCtn');
			if (!(window.location.protocol === 'https')) {
				$('#jVip').mouseenter(function() {
					$(this).addClass('menu-hover');
					// 禁止二次请求
					if (!$ctn.hasClass('jFirstClick')) {
						_self.loadVipInfo(function(data) {
							$ctn.addClass('jFirstClick').html(_self.createDownDiv(data)).stop().slideDown();
						});
					} else {
						$ctn.stop().slideDown();
					}
				}).mouseleave(function() {
					$(this).removeClass('menu-hover');
					$ctn.stop().slideUp();
				})
			}
		}
	};
	//
	$.fn.identityInfo = function(opt) {
		opt = $.extend(identityInfo, defaultSetting, opt);
		opt.selector = $(this);
		opt.init();
	}
});