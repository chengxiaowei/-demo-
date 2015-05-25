//扩展验证方法
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery');
	var _ = require('./jquery.validate');
	var messages = {
		required: "必填字段",
		remote: "Please fix this field.",
		email: "邮箱地址不正确",
		url: "网址不正确",
		date: "日期格式不正确",
		dateISO: "Please enter a valid date ( ISO ).",
		number: "请输入数字",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format("最多可输入 {0} 个字符"),
		minlength: $.validator.format("至少输入 {0} 个字符"),
		rangelength: $.validator.format("{0}<= 字符数 <={1}"),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("最小的数值为 {0}.")
	};


	var methods = {
		//手机
		mobile : function(value, element) {
			return this.optional( element ) || /^1[\d]{10}$/.test( value );
		},
		//固定电话
		fixedTel : function( value, element ) {
			return this.optional( element ) || /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test( value );
		},
		//验证特殊字符 
		SpChar : function( value, element ){
			return this.optional( element ) || !(/[~#^$@%&!*'<>]/gi).test( value );
		}
	}
	$.extend($.validator.methods ,methods);
	//messages
	var messages = {
		SpChar : "不能输入~#^$@%&!*'<>等特殊字符"
	};
	$.extend($.validator.messages ,messages);
})