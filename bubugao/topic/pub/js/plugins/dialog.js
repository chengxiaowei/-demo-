/**
 * 弹窗-应用级
 *
 * @author djune update@2014.8.8
 */
define(function(require) {
	'use strict';
	var bbg = require('../core/bbg');
	var Dialog = require('../ui/dialog/dialog-plus');
	/**
	 * 对话框的抽象
	 */
	BBG.Dialog = {
		/**
		 * 默认自动关闭时间
		 */
		autoTime: 2000,
		/**
		 * ajax加载中...
		 *
		 * @param options
		 * @author jiangchaoyi update@2014.8.3
		 */
		loading: function(options) {
			var defaults = {
				url: '', // ajax请求的地址
				data: {}, // ajax请求参数
				type: 'GET', // ajax请求方式，默认是'GET'方式
				sucCallback: function(data) {}, // 成功回调
				errCallback: function(data) {}, // 失败回调
				text: '正在加载,请稍后...', // 提示文本
				isModal: true
					// 是否加遮罩
			};
			var opt = $.extend(true, {}, defaults, options || {});
			var dialog = Dialog({
				'id': '_dialogForLoading',
				'type': 'loading-text',
				'content': opt.text
			});
			if (opt.isModal) {
				dialog.showModal();
			} else {
				dialog.show();
			}
			BBG.AJAX.ajax(opt, function(data) {
				opt.sucCallback && opt.sucCallback(data);
				dialog.remove();
			}, function(data) {
				opt.errCallback && opt.errCallback(data);
				dialog.remove();
			});
		},
		/**
		 * 确认
		 *
		 * @param {String}
		 *            content 内容
		 * @param {Function}
		 *            okFn 确定回调函数
		 * @param {Function}
		 *            cancelFn 取消回调函数
		 * @param {Dom
		 *            element} btn 按钮，只支持原生dom节点
		 *
		 */
		confirm: function(content, okFn, cancelFn, btn) {
			return Dialog({
				'id': '_dialogConfirm',
				'type': 'question',
				'content': content,
				'align': 'top right',
				'okValue': '确定',
				'ok': function() {
					okFn && okFn();
				},
				'cancelValue': '取消',
				'cancel': function() {
					cancelFn && cancelFn();
				}
			}).show(btn);
		},
		/**
		 * 错误
		 *
		 * @param {String}
		 *            content 内容
		 * @param {Dom
		 *            element} btn 按钮，只支持原生dom节点
		 * @param {int}
		 *            time 自动关闭时间，单位毫秒,默认:2000
		 *
		 */
		error: function(content, btn, time) {
			return Dialog({
				'id': '_dialogError',
				'type': 'error',
				'align': 'top',
				'content': content
			}).time(btn, time || BBG.Dialog.autoTime);
		},
		/**
		 * 警告
		 *
		 * @param {String}
		 *            content 内容
		 * @param {Dom
		 *            element} btn 按钮，只支持原生dom节点
		 * @param {int}
		 *            time 自动关闭时间，单位毫秒,默认:2000
		 *
		 */
		warning: function(content, btn, time) {
			return Dialog({
				'id': '_dialogWarning',
				'type': 'warning',
				'align': 'top',
				'content': content
			}).time(btn, time || BBG.Dialog.autoTime);
		},
		/**
		 * 正确
		 *
		 * @param {String}
		 *            content 内容
		 * @param {Dom
		 *            element} btn 按钮，只支持原生dom节点
		 * @param {int}
		 *            time 自动关闭时间，单位毫秒,默认:2000
		 *
		 */
		ok: function(content, btn, time) {
			return Dialog({
				'id': '_dialogOk',
				'type': 'ok',
				'align': 'top',
				'content': content
			}).time(btn, time || BBG.Dialog.autoTime);
		},
		/**
		 * 普通提示
		 *
		 * @param {String}
		 *            content 内容
		 * @param {Dom
		 *            element} btn 按钮，只支持原生dom节点
		 * @param {int}
		 *            time 自动关闭时间，单位毫秒,默认:2000
		 *
		 */
		tips: function(content, btn, time) {
			return Dialog({
				'id': '_dialogTips',
				'type': 'tips',
				'align': 'top',
				'content': content
			}).time(btn, time || BBG.Dialog.autoTime);
		},
        /**
		 * 等待
		 *
		 * @param {String}
		 *            content 内容
		 * @param {Dom
		 *            element} btn 按钮，只支持原生dom节点
		 * @param {int}
		 *            time 自动关闭时间，单位毫秒,默认:2000
		 *
		 */
        waiting: function(content, callback, btn, time) {
            var dlg = Dialog({
                'id': '_dialogTips',
				'type': 'tips',
				'align': 'top',
                'content': '<p class="tips-div">' + (content || 'loading...') + '</p>'
            }).time(btn, time || BBG.Dialog.autoTime);
            
            callback && callback();
            return dlg;
		},
        /**
         * 模式弹出框
         */
        pop: function(opt) {
            return Dialog($.extend({id: '_dialogPop'}, opt)).showModal();
	    }
	};

	return Dialog;
});
