/**
 * @author huangriya
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery');
	var Dialog = require('../ui/dialog/dialog-plus');
	var template = require('template');
	var url = {
		add: '//i.yunhou.com/certification/add',
		update: '//i.yunhou.com/certification/edit',
		updateName: '//i.yunhou.com/certification/update',
		del: '//i.yunhou.com/certification/delete'
	};
	//
	var tmplHtml = ['<table class="realname-table">',
		'<tr><td class="td1"><span>*</span>真实姓名：</td><td><input type="hidden" name="id" id="jIdText" /><input type="text" id="jNameText" class="text"/></td></tr>',
		'<tr><td class="td1"><span>*</span>身份证号码：</td><td><input type="text" class="text" id="jIdCard"/></td></tr>',
		'<tr><td class="td1"></td><td>',
		'<span class="bttome" id="jBetOk">确定</span>',
		'<span class="bttome" id="jBetPrese">保存</span>',
		'</td></tr>',
		'</table>'
	].join('');

	var verification = {
		//设置url
		setUrl: function(_url) {
			url = _url;
		},
		//添加弹出框
		tmp: function(okfn, nofn) {
			var rd = template.compile(tmplHtml);
			var dlg = Dialog({
				title: '添加实名认证',
				content: rd()
			}).showModal();
			$('#jBetOk').show();
			$('#jBetPrese').hide();
			verification.add(okfn, nofn);
		},
		//添加实名认证
		add: function(okfn, nofn) {
			$('#jBetOk').click(function() {
				var name = $('#jNameText').val(),
					card = $('#jIdCard').val(),
					numberid = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
					reg = /^[\u4e00-\u9fa5]{2,10}$/;
				if (!reg.exec(name)) {
					BBG.Dialog.warning('请输入姓名(姓名由2-10中文组成)');
					return false;
				} else if (!numberid.test(card)) {
					BBG.Dialog.warning('请输入正确的身份证号');
					return false;
				} else {
					$('#jBetOk').unbind("click");
					BBG.AJAX.jsonp({
						url: url.add,
						data: {
							'idCard': card,
							'realName': name,
							'frontImg': '',
							'reverseImg': ''
						}
					}, function() {
						BBG.Dialog.ok('添加成功！');
						okfn && okfn(null);
					}, function(data) {
						if (data._error.code == "-100") {
							window.location.href = "https://ssl.yunhou.com/login/login.php?ref=" + encodeURIComponent(window.location.href) + "";
						} else {
							BBG.Dialog.error(data._error.msg, false, '3000');
							$('#jBetOk').bind("click", verification.add(okfn, nofn));
							nofn && nofn(null);
						}
					})
				}
			});
		},
		update: function(id, okfn, nofn) {
			BBG.AJAX.jsonp({
				url: url.update,
				data: {
					'id': id
				}
			}, function(data) {
				var name = data.realName,
					idCard = data.idCard,
					id = data.id;
				var _dailog = Dialog({
					title: '编辑实名认证信息',
					content: template.render('jAddAddr', {}),
					onshow: function() {
						$('#jNameText').val(name);
						$('#jIdCard').val(idCard);
						$('#jIdText').val(id);
						$('#jBetOk').hide();
						$('#jBetPrese').show();
					}
				}).showModal();
				verification.updatename(id, okfn, nofn);
			}, function(data) {
				if (data._error.code == "-100") {
					window.location.href = "https://ssl.yunhou.com/login/login.php?ref=" + encodeURIComponent(window.location.href) + "";
				} else {
					BBG.Dialog.error(data._error.msg, false, '3000');
				}
			})
		},
		updatename: function(id, okfn, nofn) {
			$('#jBetPrese').click(function() {
				var name = $('#jNameText').val(),
					card = $('#jIdCard').val(),
					frontImg = '',
					reverseImg = '',
					id = $('#jIdText').val(),
					numberid = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
					reg = /^[\u4e00-\u9fa5]{2,10}$/;

				if (!reg.exec(name)) {
					BBG.Dialog.warning('请输入姓名(姓名由2-10中文组成)');
					return false;
				} else if (!numberid.test(card)) {
					BBG.Dialog.warning('请输入正确的身份证号');
					return false;
				} else {
					$('#jBetPrese').unbind("click");
					BBG.AJAX.jsonp({
						url: url.updateName,
						data: {
							'id': id,
							'idCard': card,
							'realName': name
						}
					}, function() {
						BBG.Dialog.ok('修改成功！');
						okfn && okfn(null);
					}, function(data) {
						$('#jBetPrese').bind("click", verification.updatename(id, okfn, nofn));
						if (data._error.code == "-100") {
							window.location.href = "https://ssl.yunhou.com/login/login.php?ref=" + encodeURIComponent(window.location.href) + ""
						} else {
							BBG.Dialog.error(data._error.msg, false, '3000');
							nofn && nofn(null);
						}
					});
				}
			})
		},
		del: function(id, okfn, nofn) {
			BBG.AJAX.jsonp({
				url: url.del,
				data: {
					'id': id
				}
			}, function() {
				BBG.Dialog.ok('删除成功！');
				okfn && okfn(null);
			}, function(data) {
				if (data._error.code == "-100") {
					window.location.href = "https://ssl.yunhou.com/login/login.php?ref=" + encodeURIComponent(window.location.href) + "";
				} else {
					BBG.Dialog.error(data._error.msg, false, '3000');
					nofn && nofn(null);
				}
			})
		}
	}
	return verification;
});